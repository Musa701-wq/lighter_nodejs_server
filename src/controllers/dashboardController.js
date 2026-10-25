"use strict";

const { getCollection } = require("../db/mongo");

const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

const cache = new Map();

function getCacheKey(handlerName, limit) {
  return `${handlerName}:${limit}`;
}

function getFromCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

function wrapWithCache(handlerName, computeFn) {
  return async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || (handlerName === "getTopMovers" ? 3 : 5);
      const cacheKey = getCacheKey(handlerName, limit);

      const cached = getFromCache(cacheKey);
      if (cached) {
        return res.json({ ...cached, cached: true });
      }

      const data = await computeFn(req, limit);
      setCache(cacheKey, data);
      res.json({ ...data, cached: false });
    } catch (err) {
      next(err);
    }
  };
}

async function computeVolume(_, limit) {
  const col = getCollection();

  const [totalResult, topMarkets, totalCount] = await Promise.all([
    col.aggregate([
      { $match: { dex: "lighter" } },
      { $group: { _id: null, totalVolume: { $sum: "$volume24hUSD" } } },
    ]).toArray(),
    col.find({ dex: "lighter" })
      .sort({ volume24hUSD: -1 })
      .limit(limit)
      .toArray(),
    col.countDocuments({ dex: "lighter" }),
  ]);

  const totalVolume = totalResult[0]?.totalVolume || 0;
  const avgVolumePerMarket = totalCount > 0 ? totalVolume / totalCount : 0;
  const mostActive = topMarkets.length > 0 ? topMarkets[0] : null;

  const contributors = topMarkets.map((m) => ({
    symbol: m.symbol,
    iconUrl: m.iconUrl,
    volume24hUSD: m.volume24hUSD,
    percentage: totalVolume > 0 ? ((m.volume24hUSD / totalVolume) * 100).toFixed(2) : "0",
  }));

  return {
    success: true,
    data: {
      totalVolume,
      avgVolumePerMarket: Math.round(avgVolumePerMarket * 100) / 100,
      mostActive: mostActive
        ? { symbol: mostActive.symbol, percentage: totalVolume > 0 ? ((mostActive.volume24hUSD / totalVolume) * 100).toFixed(2) : "0" }
        : null,
      totalMarkets: totalCount,
      topContributors: contributors,
      updatedAt: new Date(),
    },
  };
}

async function computeOpenInterest(_, limit) {
  const col = getCollection();

  const [totalResult, topMarkets, totalCount] = await Promise.all([
    col.aggregate([
      { $match: { dex: "lighter" } },
      { $group: { _id: null, totalOI: { $sum: "$openInterestUSD" } } },
    ]).toArray(),
    col.find({ dex: "lighter" })
      .sort({ openInterestUSD: -1 })
      .limit(limit)
      .toArray(),
    col.countDocuments({ dex: "lighter" }),
  ]);

  const totalOI = totalResult[0]?.totalOI || 0;

  const highestOIMarkets = topMarkets.map((m) => ({
    symbol: m.symbol,
    iconUrl: m.iconUrl,
    openInterestUSD: m.openInterestUSD,
    openInterestQty: m.openInterestQty,
    markPrice: m.markPrice,
    percentage: totalOI > 0 ? ((m.openInterestUSD / totalOI) * 100).toFixed(2) : "0",
  }));

  return {
    success: true,
    data: {
      totalOpenInterestUSD: totalOI,
      totalMarkets: totalCount,
      highestOIMarkets,
      updatedAt: new Date(),
    },
  };
}

async function computeFundingRates(_, limit) {
  const col = getCollection();

  const [allMarkets, totalResult] = await Promise.all([
    col.find({ dex: "lighter" }).toArray(),
    col.aggregate([
      { $match: { dex: "lighter" } },
      {
        $group: {
          _id: null,
          avgRate: { $avg: "$funding8hPct" },
          positiveCount: { $sum: { $cond: [{ $gt: ["$funding8hPct", 0] }, 1, 0] } },
          negativeCount: { $sum: { $cond: [{ $lt: ["$funding8hPct", 0] }, 1, 0] } },
          zeroCount: { $sum: { $cond: [{ $eq: ["$funding8hPct", 0] }, 1, 0] } },
        },
      },
    ]).toArray(),
  ]);

  const stats = totalResult[0] || { avgRate: 0, positiveCount: 0, negativeCount: 0, zeroCount: 0 };

  const sorted = [...allMarkets].sort((a, b) => b.funding8hPct - a.funding8hPct);
  const topPositive = sorted.filter((m) => m.funding8hPct > 0).slice(0, limit).map((m) => ({
    symbol: m.symbol,
    iconUrl: m.iconUrl,
    funding8hPct: m.funding8hPct,
  }));

  const topNegative = [...allMarkets].sort((a, b) => a.funding8hPct - b.funding8hPct)
    .filter((m) => m.funding8hPct < 0)
    .slice(0, limit)
    .map((m) => ({
      symbol: m.symbol,
      iconUrl: m.iconUrl,
      funding8hPct: m.funding8hPct,
    }));

  return {
    success: true,
    data: {
      avgRate: stats.avgRate,
      positiveCount: stats.positiveCount,
      negativeCount: stats.negativeCount,
      zeroCount: stats.zeroCount,
      totalMarkets: allMarkets.length,
      topPositive,
      topNegative,
      updatedAt: new Date(),
    },
  };
}

async function computeTopMovers(_, limit) {
  const col = getCollection();
  const allMarkets = await col.find({ dex: "lighter" }).toArray();

  const sortedDesc = [...allMarkets]
    .filter((m) => m.change24hPct !== 0)
    .sort((a, b) => b.change24hPct - a.change24hPct);

  const gainers = sortedDesc.slice(0, limit).map((m) => ({
    symbol: m.symbol,
    iconUrl: m.iconUrl,
    change24hPct: m.change24hPct,
    markPrice: m.markPrice,
  }));

  const losers = [...allMarkets]
    .filter((m) => m.change24hPct !== 0)
    .sort((a, b) => a.change24hPct - b.change24hPct)
    .slice(0, limit)
    .map((m) => ({
      symbol: m.symbol,
      iconUrl: m.iconUrl,
      change24hPct: m.change24hPct,
      markPrice: m.markPrice,
    }));

  return {
    success: true,
    data: {
      gainers,
      losers,
      updatedAt: new Date(),
    },
  };
}

async function computePerpsMeta() {
  const col = getCollection();

  const [categories, markets, assetTypes] = await Promise.all([
    col.distinct("categories", { dex: "lighter" }),
    col.distinct("market", { dex: "lighter" }),
    col.distinct("assetType", { dex: "lighter" }),
  ]);

  return {
    success: true,
    data: {
      categories: categories.filter(Boolean).sort(),
      markets: markets.filter(Boolean).sort(),
      assetTypes: assetTypes.filter(Boolean).sort(),
      updatedAt: new Date().toISOString(),
    },
  };
}

const getVolume = wrapWithCache("getVolume", computeVolume);
const getOpenInterest = wrapWithCache("getOpenInterest", computeOpenInterest);
const getFundingRates = wrapWithCache("getFundingRates", computeFundingRates);
const getTopMovers = wrapWithCache("getTopMovers", computeTopMovers);
const getPerpsMeta = wrapWithCache("getPerpsMeta", computePerpsMeta);

function checkCache(handlerName) {
  return (req, res, next) => {
    const limit = parseInt(req.query.limit) || (handlerName === "getTopMovers" ? 3 : 5);
    const cacheKey = getCacheKey(handlerName, limit);

    const cached = getFromCache(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json({ ...cached, cached: true });
    }
    res.set('X-Cache', 'MISS');
    next();
  };
}

module.exports = { getVolume, getOpenInterest, getFundingRates, getTopMovers, getPerpsMeta, checkCache };