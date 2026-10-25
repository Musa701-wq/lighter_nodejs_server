"use strict";

const { getCollection } = require("../db/mongo");
const { createCachedHandler } = require("../utils/cache");

const DEFAULT_DEX = "lighter";
const ALLOWED_DEX = new Set(["lighter", "aster"]);

function resolveDex(req) {
  const dex = String(req.query.dex || DEFAULT_DEX).toLowerCase();
  return ALLOWED_DEX.has(dex) ? dex : DEFAULT_DEX;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, precision = 2) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function normalize(value, min, max) {
  if (max <= min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

function calculateSqueezeScore(funding8hPct, change24hPct, fundingAbsMax, changeAbsMax) {
  const fundingScore = normalize(Math.abs(funding8hPct), 0, fundingAbsMax) * 100;
  const momentumScore = normalize(Math.abs(change24hPct), 0, changeAbsMax) * 100;
  return Math.round(fundingScore * 0.6 + momentumScore * 0.4);
}

function emptySectorPerformance() {
  return {
    success: true,
    data: {
      totalCoins: 0,
      totalSectorCoins: 0,
      totalVolume24hUSD: 0,
      totalOpenInterestUSD: 0,
      bestSector: null,
      worstSector: null,
      positiveSectors: 0,
      totalSectors: 0,
      sectors: [],
      updatedAt: new Date().toISOString(),
    },
  };
}

async function computeSectorPerformance(req) {
  const dex = resolveDex(req);
  const col = getCollection();

  const markets = await col
    .find(
      { dex },
      {
        projection: {
          categories: 1,
          volume24hUSD: 1,
          openInterestUSD: 1,
          change24hPct: 1,
        },
      }
    )
    .toArray();

  if (markets.length === 0) {
    return emptySectorPerformance();
  }

  const sectorMap = new Map();

  for (const market of markets) {
    const categories = market.categories || [];
    if (categories.length === 0) continue;

    for (const cat of categories) {
      if (!sectorMap.has(cat)) {
        sectorMap.set(cat, {
          name: cat,
          totalVolume24hUSD: 0,
          totalOpenInterestUSD: 0,
          totalChange24hPct: 0,
          coinCount: 0,
        });
      }
      const sector = sectorMap.get(cat);
      sector.totalVolume24hUSD += market.volume24hUSD || 0;
      sector.totalOpenInterestUSD += market.openInterestUSD || 0;
      sector.totalChange24hPct += market.change24hPct || 0;
      sector.coinCount += 1;
    }
  }

  const totalVolume24hUSD = markets.reduce(
    (sum, m) => sum + (m.volume24hUSD || 0),
    0
  );
  const totalOpenInterestUSD = markets.reduce(
    (sum, m) => sum + (m.openInterestUSD || 0),
    0
  );

  const sectors = [...sectorMap.values()]
    .map((data) => ({
      name: data.name,
      avgChange24hPct:
        data.coinCount > 0
          ? round(data.totalChange24hPct / data.coinCount, 3)
          : 0,
      volume24hUSD: round(data.totalVolume24hUSD),
      volumePct:
        totalVolume24hUSD > 0
          ? round((data.totalVolume24hUSD / totalVolume24hUSD) * 100)
          : 0,
      openInterestUSD: round(data.totalOpenInterestUSD),
      coinCount: data.coinCount,
    }))
    .sort((a, b) => b.volume24hUSD - a.volume24hUSD);

  const positiveSectors = sectors.filter((s) => s.avgChange24hPct > 0).length;

  let bestSector = null;
  let worstSector = null;
  for (const sector of sectors) {
    if (!bestSector || sector.avgChange24hPct > bestSector.avgChange24hPct) {
      bestSector = sector;
    }
    if (!worstSector || sector.avgChange24hPct < worstSector.avgChange24hPct) {
      worstSector = sector;
    }
  }

  return {
    success: true,
    data: {
      totalCoins: markets.length,
      totalSectorCoins: sectors.reduce((sum, s) => sum + s.coinCount, 0),
      totalVolume24hUSD: round(totalVolume24hUSD),
      totalOpenInterestUSD: round(totalOpenInterestUSD),
      bestSector: bestSector
        ? { name: bestSector.name, change24hPct: bestSector.avgChange24hPct }
        : null,
      worstSector: worstSector
        ? { name: worstSector.name, change24hPct: worstSector.avgChange24hPct }
        : null,
      positiveSectors,
      totalSectors: sectors.length,
      sectors,
      updatedAt: new Date().toISOString(),
    },
  };
}

async function computeSqueezeScore(req) {
  const dex = resolveDex(req);
  const col = getCollection();

  const markets = await col
    .find(
      { dex },
      {
        projection: {
          symbol: 1,
          iconUrl: 1,
          funding8hPct: 1,
          change24hPct: 1,
        },
      }
    )
    .toArray();

  const buckets = {
    highRisk: [],
    mediumRisk: [],
    lowRisk: [],
    minimalRisk: [],
  };

  const fundingAbsMax = Math.max(
    0,
    ...markets.map((m) => Math.abs(m.funding8hPct || 0))
  );
  const changeAbsMax = Math.max(
    0,
    ...markets.map((m) => Math.abs(m.change24hPct || 0))
  );

  for (const market of markets) {
    const score = calculateSqueezeScore(
      market.funding8hPct || 0,
      market.change24hPct || 0,
      fundingAbsMax,
      changeAbsMax
    );

    const item = {
      symbol: market.symbol,
      iconUrl: market.iconUrl || "/hyperliquid.png",
      score,
    };

    if (score >= 70) {
      buckets.highRisk.push(item);
    } else if (score >= 40) {
      buckets.mediumRisk.push(item);
    } else if (score >= 20) {
      buckets.lowRisk.push(item);
    } else {
      buckets.minimalRisk.push(item);
    }
  }

  for (const key of Object.keys(buckets)) {
    buckets[key].sort((a, b) => b.score - a.score);
  }

  return {
    success: true,
    data: {
      ...buckets,
      updatedAt: new Date().toISOString(),
    },
  };
}

async function computeFundingRates(req) {
  const dex = resolveDex(req);
  const col = getCollection();

  const markets = await col
    .find(
      { dex },
      {
        projection: {
          symbol: 1,
          iconUrl: 1,
          funding8hPct: 1,
        },
      }
    )
    .toArray();

  const rates = markets
    .map((m) => ({
      symbol: m.symbol,
      iconUrl: m.iconUrl || "/hyperliquid.png",
      funding8hPct: m.funding8hPct || 0,
    }))
    .sort((a, b) => b.funding8hPct - a.funding8hPct);

  return {
    success: true,
    data: {
      rates,
      updatedAt: new Date().toISOString(),
    },
  };
}

const getSectorPerformance = createCachedHandler(
  "sectorPerformance",
  computeSectorPerformance
);
const getSqueezeScore = createCachedHandler("squeezeScore", computeSqueezeScore);
const getFundingRates = createCachedHandler(
  "fundingRates",
  computeFundingRates
);

module.exports = { getSectorPerformance, getSqueezeScore, getFundingRates };
