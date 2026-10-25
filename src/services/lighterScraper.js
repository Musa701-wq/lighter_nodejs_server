// "use strict";

// const config = require("../config");
// const { getCollection } = require("../db/mongo");
// const { getCategories } = require("../config/lighterCategories");
// const {
//   fetchOrderBookDetails,
//   fetchFundingRates,
//   randomInterval,
//   num,
//   getLighterIconUrl,
// } = require("../utils/lighterHelpers");
// const logger = require("../utils/logger");

// let broadcastFunction = null;

// function setBroadcastFunction(broadcastFn) {
//   broadcastFunction = broadcastFn;
// }

// async function tick() {
//   const col = getCollection();
//   const now = new Date();
//   const startTime = Date.now();

//   try {
//     const [orderBookRes, fundingRes] = await Promise.all([
//       fetchOrderBookDetails(),
//       fetchFundingRates(),
//     ]);

//     const markets = orderBookRes?.order_book_details || [];
//     if (!Array.isArray(markets) || markets.length === 0) {
//       logger.warn("No lighter markets found");
//       return;
//     }

//     const fundingMap = new Map();
//     const rates = fundingRes?.funding_rates || [];
//     if (Array.isArray(rates)) {
//       for (const r of rates) {
//         if (r.market_id != null) fundingMap.set(r.market_id, r.rate);
//       }
//     }

//     const ops = [];
//     const updatedRows = [];
//     const dexName = "lighter";

//     let layer1Count = 0,
//       layer2Count = 0,
//       memesCount = 0,
//       aiCount = 0,
//       equitiesCount = 0;
//     let etfIndexCount = 0,
//       fxCount = 0,
//       krwCount = 0,
//       commoditiesCount = 0,
//       preIpoCount = 0,
//       otherCount = 0;

//     for (const market of markets) {
//       if (market.status !== "active") continue;
//       if (market.market_type !== "perp") continue;

//       const symbol = market.symbol;
//       if (!symbol) continue;

//       const categories = getCategoriesForSymbol(symbol);
//       const lastPrice = num(market.last_trade_price);
//       const markPrice = num(market.last_trade_price);
//       const change24hPct = num(market.daily_price_change);
//       const fundingRate = fundingMap.get(market.market_id);
//       const funding8hPct = fundingRate != null ? num(fundingRate) : 0;
//       const volume24hUSD = num(market.daily_quote_token_volume);
//       const openInterestQty = num(market.open_interest);
//       const openInterestUSD = openInterestQty * (markPrice || lastPrice);
//       const openInterestDisplayUSD = openInterestUSD;

//       if (openInterestQty === 0 && lastPrice === 0) continue;

//       if (categories.includes("layer1") || categories.includes("majors")) layer1Count++;
//       if (categories.includes("layer2")) layer2Count++;
//       if (categories.includes("memes")) memesCount++;
//       if (categories.includes("ai")) aiCount++;
//       if (categories.includes("equities")) equitiesCount++;
//       if (categories.includes("etf/index")) etfIndexCount++;
//       if (categories.includes("FX")) fxCount++;
//       if (categories.includes("KRW")) krwCount++;
//       if (categories.includes("commodities")) commoditiesCount++;
//       if (categories.includes("pre ipo")) preIpoCount++;
//       if (categories.includes("other")) otherCount++;

//       const row = {
//         dex: dexName,
//         symbol,
//         fullSymbol: `${dexName}:${symbol}`,
//         displayName: symbol,
//         categories,
//         markPrice,
//         change24hPct,
//         funding8hPct,
//         volume24hUSD,
//         openInterestQty,
//         openInterestUSD,
//         openInterestDisplayUSD,
//         iconUrl: getLighterIconUrl(symbol),
//         updatedAt: now,
//       };

//       updatedRows.push(row);
//       ops.push({
//         updateOne: {
//           filter: { dex: dexName, symbol },
//           update: { $set: row },
//           upsert: true,
//         },
//       });
//     }

//     if (ops.length > 0) {
//       const activeSymbols = updatedRows.map((r) => r.symbol);

//       await col.deleteMany({ dex: dexName, symbol: { $nin: activeSymbols } });
//       await col.bulkWrite(ops, { ordered: false });

//       const duration = ((Date.now() - startTime) / 1000).toFixed(2);
//       console.log(`✅ Scraped ${ops.length} active Lighter markets (${duration}s)`);
//       console.log(
//         `   Layer1/Majors: ${layer1Count} | Layer2: ${layer2Count} | Memes: ${memesCount} | AI: ${aiCount} | Equities: ${equitiesCount}`
//       );
//       console.log(
//         `   ETF/Index: ${etfIndexCount} | FX: ${fxCount} | KRW: ${krwCount} | Commodities: ${commoditiesCount} | Pre-IPO: ${preIpoCount} | Other: ${otherCount}`
//       );

//       if (broadcastFunction) {
//         broadcastFunction({
//           type: "markets_update",
//           dex: dexName,
//           categoryCounts: {
//             layer1: layer1Count,
//             layer2: layer2Count,
//             memes: memesCount,
//             ai: aiCount,
//             equities: equitiesCount,
//             "etf/index": etfIndexCount,
//             FX: fxCount,
//             KRW: krwCount,
//             commodities: commoditiesCount,
//             "pre ipo": preIpoCount,
//             other: otherCount,
//           },
//           data: updatedRows,
//           timestamp: now,
//         });
//       }
//     }
//   } catch (err) {
//     logger.error(`Lighter scraper error: ${err.message}`);
//   }
// }

// let scraperRunning = false;
// let currentTimeoutHandle = null;
// let currentIsRunning = false;

// function startScraper() {
//   if (scraperRunning) {
//     console.log("Lighter scraper already running");
//     return;
//   }

//   console.log("Starting Lighter scraper with random 5-10s intervals");
//   scraperRunning = true;

//   const runTick = async () => {
//     if (!scraperRunning) return;

//     if (currentIsRunning) {
//       console.log("Previous lighter scrape still running, skipping this cycle");
//       currentTimeoutHandle = setTimeout(runTick, randomInterval(5000, 10000));
//       return;
//     }

//     currentIsRunning = true;
//     const cycleStart = Date.now();

//     try {
//       await tick();
//     } catch (err) {
//       logger.error(`Lighter scraper error: ${err.message}`);
//     }

//     const duration = (Date.now() - cycleStart) / 1000;
//     currentIsRunning = false;

//     const waitTime = randomInterval(config.scraper.minInterval, config.scraper.maxInterval);
//     console.log(`Cycle took ${duration.toFixed(2)}s, next cycle in ${(waitTime / 1000).toFixed(2)}s`);

//     if (scraperRunning) {
//       currentTimeoutHandle = setTimeout(runTick, waitTime);
//     }
//   };

//   runTick();
// }

// function stopScraper() {
//   if (!scraperRunning) return;
//   console.log("Stopping Lighter scraper");
//   scraperRunning = false;
//   if (currentTimeoutHandle) {
//     clearTimeout(currentTimeoutHandle);
//     currentTimeoutHandle = null;
//   }
// }

// let activeConnections = 0;

// function incrementConnections() {
//   activeConnections++;
//   console.log(`Lighter active connections: ${activeConnections}`);
//   if (activeConnections === 1) startScraper();
// }

// function decrementConnections() {
//   activeConnections = Math.max(0, activeConnections - 1);
//   console.log(`Lighter active connections: ${activeConnections}`);
//   if (activeConnections === 0) stopScraper();
// }

// module.exports = { startScraper, stopScraper, setBroadcastFunction, incrementConnections, decrementConnections };


"use strict";

const config = require("../config");
const { getCollection } = require("../db/mongo");
const { getCategoriesForSymbol, loadTokenMetadata, getTokenMetadata } = require("../utils/tokenMetadata");
const {
  fetchOrderBookDetails,
  fetchFundingRates,
  randomInterval,
  num,
  getLighterIconUrl,
  getLighterIconUrlSync,
  preloadTokenIcons,
} = require("../utils/lighterHelpers");
const logger = require("../utils/logger");

let broadcastFunction = null;
let iconCacheReady = false;

function setBroadcastFunction(broadcastFn) {
  broadcastFunction = broadcastFn;
}

async function ensureIconCache() {
  if (iconCacheReady) return;
  
  try {
    // Get all unique token symbols from the database first
    const col = getCollection();
    const existingTokens = await col.find({ dex: "lighter" }).toArray();
    const tokenSymbols = existingTokens.map(t => t.symbol);
    
    if (tokenSymbols.length > 0) {
      console.log(`Preloading icons for ${tokenSymbols.length} existing tokens...`);
      await preloadTokenIcons(tokenSymbols);
    }
    iconCacheReady = true;
  } catch (err) {
    logger.warn(`Failed to preload icon cache: ${err.message}`);
    iconCacheReady = true; // Don't block scraping
  }
}

async function tick() {
  const col = getCollection();
  const now = new Date();
  const startTime = Date.now();

  await loadTokenMetadata();
  await ensureIconCache();

  try {
    const [orderBookRes, fundingRes] = await Promise.all([
      fetchOrderBookDetails(),
      fetchFundingRates(),
    ]);

    const markets = orderBookRes?.order_book_details || [];
    if (!Array.isArray(markets) || markets.length === 0) {
      logger.warn("No lighter markets found");
      return;
    }

    const fundingMap = new Map();
    const rates = fundingRes?.funding_rates || [];
    if (Array.isArray(rates)) {
      for (const r of rates) {
        if (r.market_id != null) fundingMap.set(r.market_id, r.rate);
      }
    }

    const ops = [];
    const updatedRows = [];
    const dexName = "lighter";

    const categoryCounts = {};

    // Collect all unique symbols first for batch icon fetching
    const symbols = [];
    for (const market of markets) {
      if (market.status !== "active") continue;
      if (market.market_type !== "perp") continue;
      const symbol = market.symbol;
      if (!symbol) continue;
      symbols.push(symbol);
    }

    // Fetch icons in parallel for all symbols (uses cache after first run)
    const iconPromises = symbols.map(symbol => getLighterIconUrl(symbol));
    const iconResults = await Promise.all(iconPromises);
    const iconMap = new Map();
    symbols.forEach((symbol, idx) => {
      iconMap.set(symbol, iconResults[idx]);
    });

    for (let i = 0; i < markets.length; i++) {
      const market = markets[i];
      if (market.status !== "active") continue;
      if (market.market_type !== "perp") continue;

      const symbol = market.symbol;
      if (!symbol) continue;

      const categories = getCategoriesForSymbol(symbol);
      const lastPrice = num(market.last_trade_price);
      const markPrice = num(market.last_trade_price);
      const change24hPct = num(market.daily_price_change);
      const fundingRate = fundingMap.get(market.market_id);
      const funding8hPct = fundingRate != null ? num(fundingRate) * 100 : 0;
      const volume24hUSD = num(market.daily_quote_token_volume);
      const openInterestQty = num(market.open_interest);
      const openInterestUSD = openInterestQty * (markPrice || lastPrice) * 2;
      const openInterestDisplayUSD = openInterestUSD;

      if (openInterestQty === 0 && lastPrice === 0) continue;

      for (const cat of categories) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }

      const meta = getTokenMetadata(symbol);

       const row = {
         dex: dexName,
         symbol,
         fullSymbol: `${dexName}:${symbol}`,
         displayName: symbol,
         categories,
         marketType: market.market_type,
         market: "PERPS",
         assetType: meta?.assetType || "CRYPTO",
         tokenName: meta?.name || null,
         tokenLogo: meta?.logo || null,
         markPrice,
         change24hPct,
         funding8hPct,
         volume24hUSD,
         openInterestQty,
         openInterestUSD,
         openInterestDisplayUSD,
         iconUrl: iconMap.get(symbol) || "/hyperliquid.png",
         updatedAt: now,
       };

       updatedRows.push(row);
       ops.push({
         updateOne: {
           filter: { dex: dexName, symbol },
update: {
              $set: {
                markPrice,
                change24hPct,
                funding8hPct,
                volume24hUSD,
                openInterestQty,
                openInterestUSD,
                openInterestDisplayUSD,
                iconUrl: row.iconUrl,
                categories,
                market: "PERPS",
                assetType: meta?.assetType || "CRYPTO",
                tokenName: meta?.name || null,
                tokenLogo: meta?.logo || null,
                marketType: market.market_type,
                updatedAt: now,
              },
              $setOnInsert: {
                dex: dexName,
                symbol,
                fullSymbol: row.fullSymbol,
                displayName: symbol,
              },
            },
           upsert: true,
         },
       });
    }

    if (ops.length > 0) {
      const activeSymbols = updatedRows.map((r) => r.symbol);

       await col.deleteMany({ dex: dexName, symbol: { $nin: activeSymbols } });
       await col.bulkWrite(ops, { ordered: false });

       const duration = ((Date.now() - startTime) / 1000).toFixed(2);
       console.log(`✅ Scraped ${ops.length} active Lighter markets (${duration}s)`);
      console.log(`   Category counts: ${JSON.stringify(categoryCounts)}`);

      if (broadcastFunction) {
        broadcastFunction({
          type: "markets_update",
          dex: dexName,
          categoryCounts,
           data: updatedRows,
           timestamp: now,
         });
       }
    }
  } catch (err) {
    logger.error(`Lighter scraper error: ${err.message}`);
  }
}

let scraperRunning = false;
let currentTimeoutHandle = null;
let currentIsRunning = false;

function startScraper() {
  if (scraperRunning) {
    console.log("Lighter scraper already running");
    return;
  }

  console.log("Starting Lighter scraper with random 5-10s intervals");
  scraperRunning = true;

  const runTick = async () => {
    if (!scraperRunning) return;

    if (currentIsRunning) {
      console.log("Previous lighter scrape still running, skipping this cycle");
      currentTimeoutHandle = setTimeout(runTick, randomInterval(5000, 10000));
      return;
    }

    currentIsRunning = true;
    const cycleStart = Date.now();

    try {
      await tick();
    } catch (err) {
      logger.error(`Lighter scraper error: ${err.message}`);
    }

    const duration = (Date.now() - cycleStart) / 1000;
    currentIsRunning = false;

    const waitTime = randomInterval(config.scraper.minInterval, config.scraper.maxInterval);
    console.log(`Cycle took ${duration.toFixed(2)}s, next cycle in ${(waitTime / 1000).toFixed(2)}s`);

    if (scraperRunning) {
      currentTimeoutHandle = setTimeout(runTick, waitTime);
    }
  };

  runTick();
}

function stopScraper() {
  if (!scraperRunning) return;
  console.log("Stopping Lighter scraper");
  scraperRunning = false;
  if (currentTimeoutHandle) {
    clearTimeout(currentTimeoutHandle);
    currentTimeoutHandle = null;
  }
}

let activeConnections = 0;

function incrementConnections() {
  activeConnections++;
  console.log(`Lighter active connections: ${activeConnections}`);
  if (activeConnections === 1) startScraper();
}

function decrementConnections() {
  activeConnections = Math.max(0, activeConnections - 1);
  console.log(`Lighter active connections: ${activeConnections}`);
  if (activeConnections === 0) stopScraper();
}

module.exports = { startScraper, stopScraper, setBroadcastFunction, incrementConnections, decrementConnections };