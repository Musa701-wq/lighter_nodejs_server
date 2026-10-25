// // // // "use strict";

// // // // const config = require("../config");
// // // // const logger = require("./logger");

// // // // function getJsonWithTimeout(url, timeout = 8000) {
// // // //   const controller = new AbortController();
// // // //   const timeoutId = setTimeout(() => controller.abort(), timeout);

// // // //   return (async () => {
// // // //     try {
// // // //       const res = await fetch(url, {
// // // //         headers: { Accept: "application/json" },
// // // //         signal: controller.signal,
// // // //       });
// // // //       const text = await res.text();
// // // //       let data;
// // // //       try {
// // // //         data = JSON.parse(text);
// // // //       } catch (err) {
// // // //         if (!res.ok)
// // // //           throw new Error(`HTTP ${res.status}: ${text.substring(0, 200)}`);
// // // //         throw new Error(`JSON parse error: ${text.substring(0, 200)}`);
// // // //       }
// // // //       if (!res.ok)
// // // //         throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
// // // //       return data;
// // // //     } finally {
// // // //       clearTimeout(timeoutId);
// // // //     }
// // // //   })();
// // // // }

// // // // async function fetchOrderBookDetails() {
// // // //   const url = `${config.lighter.baseUrl}/api/v1/orderBookDetails?filter=perp`;
// // // //   return getJsonWithTimeout(url);
// // // // }

// // // // async function fetchFundingRates() {
// // // //   const url = `${config.lighter.baseUrl}/api/v1/funding-rates`;
// // // //   return getJsonWithTimeout(url);
// // // // }

// // // // function fetchMarketStatsViaWS() {
// // // //   return new Promise((resolve, reject) => {
// // // //     const WebSocket = require("ws");
// // // //     const ws = new WebSocket(config.lighter.wsUrl);
// // // //     const timeout = setTimeout(() => {
// // // //       ws.close();
// // // //       reject(new Error("WebSocket market_stats timeout"));
// // // //     }, 15000);

// // // //     ws.on("open", () => {
// // // //       ws.send(JSON.stringify({ type: "subscribe", channel: "market_stats/all" }));
// // // //     });

// // // //     ws.on("message", (raw) => {
// // // //       try {
// // // //         const msg = JSON.parse(raw.toString());
// // // //         if (msg.type === "update/market_stats" && msg.channel === "market_stats:all") {
// // // //           clearTimeout(timeout);
// // // //           ws.close();
// // // //           resolve(msg);
// // // //         }
// // // //       } catch (err) {
// // // //         logger.warn(`WS parse error: ${err.message}`);
// // // //       }
// // // //     });

// // // //     ws.on("error", (err) => {
// // // //       clearTimeout(timeout);
// // // //       reject(err);
// // // //     });

// // // //     ws.on("close", () => clearTimeout(timeout));
// // // //   });
// // // // }

// // // // function randomInterval(minMs, maxMs) {
// // // //   return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
// // // // }

// // // // function num(v) {
// // // //   const n = Number(v);
// // // //   return Number.isFinite(n) ? n : 0;
// // // // }

// // // // function getLighterIconUrl(symbol) {
// // // //   if (!symbol) return "/hyperliquid.png";
// // // //   const base = symbol.toUpperCase().trim();
// // // //   return `https://bin.bnbstatic.com/static/assets/logos/${base}.png`;
// // // // }

// // // // module.exports = {
// // // //   fetchOrderBookDetails,
// // // //   fetchFundingRates,
// // // //   fetchMarketStatsViaWS,
// // // //   randomInterval,
// // // //   num,
// // // //   getLighterIconUrl,
// // // // };


// // // "use strict";

// // // const config = require("../config");
// // // const logger = require("./logger");

// // // function getJsonWithTimeout(url, timeout = 8000) {
// // //   const controller = new AbortController();
// // //   const timeoutId = setTimeout(() => controller.abort(), timeout);

// // //   return (async () => {
// // //     try {
// // //       const res = await fetch(url, {
// // //         headers: { Accept: "application/json" },
// // //         signal: controller.signal,
// // //       });
// // //       const text = await res.text();
// // //       let data;
// // //       try {
// // //         data = JSON.parse(text);
// // //       } catch (err) {
// // //         if (!res.ok)
// // //           throw new Error(`HTTP ${res.status}: ${text.substring(0, 200)}`);
// // //         throw new Error(`JSON parse error: ${text.substring(0, 200)}`);
// // //       }
// // //       if (!res.ok)
// // //         throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
// // //       return data;
// // //     } finally {
// // //       clearTimeout(timeoutId);
// // //     }
// // //   })();
// // // }

// // // async function fetchOrderBookDetails() {
// // //   const url = `${config.lighter.baseUrl}/api/v1/orderBookDetails?filter=perp`;
// // //   return getJsonWithTimeout(url);
// // // }

// // // async function fetchFundingRates() {
// // //   const url = `${config.lighter.baseUrl}/api/v1/funding-rates`;
// // //   return getJsonWithTimeout(url);
// // // }

// // // function fetchMarketStatsViaWS() {
// // //   return new Promise((resolve, reject) => {
// // //     const WebSocket = require("ws");
// // //     const ws = new WebSocket(config.lighter.wsUrl);
// // //     const timeout = setTimeout(() => {
// // //       ws.close();
// // //       reject(new Error("WebSocket market_stats timeout"));
// // //     }, 15000);

// // //     ws.on("open", () => {
// // //       ws.send(JSON.stringify({ type: "subscribe", channel: "market_stats/all" }));
// // //     });

// // //     ws.on("message", (raw) => {
// // //       try {
// // //         const msg = JSON.parse(raw.toString());
// // //         if (msg.type === "update/market_stats" && msg.channel === "market_stats:all") {
// // //           clearTimeout(timeout);
// // //           ws.close();
// // //           resolve(msg);
// // //         }
// // //       } catch (err) {
// // //         logger.warn(`WS parse error: ${err.message}`);
// // //       }
// // //     });

// // //     ws.on("error", (err) => {
// // //       clearTimeout(timeout);
// // //       reject(err);
// // //     });

// // //     ws.on("close", () => clearTimeout(timeout));
// // //   });
// // // }

// // // function randomInterval(minMs, maxMs) {
// // //   return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
// // // }

// // // function num(v) {
// // //   const n = Number(v);
// // //   return Number.isFinite(n) ? n : 0;
// // // }

// // // /**
// // //  * Get token icon URL from CoinGecko (supports multiple formats)
// // //  * @param {string} symbol - Token symbol (e.g., 'CRO', 'BIO')
// // //  * @returns {string} CoinGecko image URL
// // //  */
// // // function getLighterIconUrl(symbol) {
// // //   if (!symbol) return "/hyperliquid.png";

// // //   const base = symbol.toUpperCase().trim();

// // //   // CoinGecko icon URLs - they support CORS and have better availability
// // //   // Option 1: Using CoinGecko's CDN (most reliable)
// // //   return `https://assets.coingecko.com/coins/images/thumb/${getCoinGeckoId(base)}`;

// // //   // Option 2: Using CoinGecko's fallback pattern (if you have coin IDs)
// // //   // return `https://www.coingecko.com/coins/${getCoinId(base)}/thumb.png`;

// // //   // Option 3: Generic CoinGecko pattern for smaller icons
// // //   // return `https://static.coingecko.com/s/image/coins/${getCoinGeckoId(base)}.png`;
// // // }

// // // /**
// // //  * Map token symbols to CoinGecko coin IDs
// // //  * You'll need to expand this mapping based on your tokens
// // //  */
// // // function getCoinGeckoId(symbol) {
// // //   const mapping = {
// // //     'CRO': 'crypto-com-chain',
// // //     'BIO': 'bio-protocol',
// // //     'RESOLV': 'resolv', // You may need to verify this ID
// // //     'APEX': 'apex-token',
// // //     'NMR': 'numeraire',
// // //     '2Z': '2z', // Verify this exists
// // //     '0G': '0g', // Verify this exists
// // //     'DOLO': 'dolo',
// // //     'SYRUP': 'syrup',
// // //     '1000NOT': 'notcoin',
// // //     'AVNT': 'aventus',
// // //     // Add more mappings as needed
// // //   };

// // //   return mapping[symbol] || symbol.toLowerCase();
// // // }

// // // /**
// // //  * Alternative: Use direct CoinGecko API to fetch token info
// // //  * This is more reliable but requires an API call
// // //  */
// // // async function getCoinGeckoImageUrlFromAPI(symbol) {
// // //   try {
// // //     const url = `https://api.coingecko.com/api/v3/search?query=${symbol}`;
// // //     const data = await getJsonWithTimeout(url, 5000);

// // //     if (data.coins && data.coins.length > 0) {
// // //       const coin = data.coins[0];
// // //       return coin.thumb || coin.small || coin.large;
// // //     }
// // //     return null;
// // //   } catch (err) {
// // //     logger.warn(`Failed to fetch CoinGecko image for ${symbol}: ${err.message}`);
// // //     return null;
// // //   }
// // // }

// // // /**
// // //  * Best solution: Use multiple fallback sources
// // //  */
// // // function getIconUrlWithFallback(symbol) {
// // //   if (!symbol) return "/hyperliquid.png";

// // //   const base = symbol.toUpperCase().trim();
// // //   const lowerSymbol = base.toLowerCase();

// // //   // Primary: CoinGecko (CORS friendly)
// // //   const coingeckoUrl = `https://assets.coingecko.com/coins/images/thumb/${lowerSymbol}.png`;

// // //   // Fallback 1: Trust Wallet assets (CORS friendly)
// // //   const trustWalletUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${lowerSymbol}/logo.png`;

// // //   // Fallback 2: Spothq crypto icons (CORS friendly)
// // //   const spothqUrl = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${lowerSymbol}.png`;

// // //   // Return primary URL - you can implement a priority system in your component
// // //   return coingeckoUrl;
// // // }

// // // // Export both the simple and advanced versions
// // // module.exports = {
// // //   fetchOrderBookDetails,
// // //   fetchFundingRates,
// // //   fetchMarketStatsViaWS,
// // //   randomInterval,
// // //   num,
// // //   getLighterIconUrl,  // Keep original name for backward compatibility
// // //   getIconUrlWithFallback,
// // //   getCoinGeckoImageUrlFromAPI,
// // // };

// // "use strict";

// // const config = require("../config");
// // const logger = require("./logger");

// // // In-memory cache for token icons (clears on server restart)
// // // For persistence across restarts, use Redis or a database
// // const iconCache = new Map();
// // let lastCacheUpdate = null;
// // const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// // function getJsonWithTimeout(url, timeout = 8000) {
// //   const controller = new AbortController();
// //   const timeoutId = setTimeout(() => controller.abort(), timeout);

// //   return (async () => {
// //     try {
// //       const res = await fetch(url, {
// //         headers: { Accept: "application/json" },
// //         signal: controller.signal,
// //       });
// //       const text = await res.text();
// //       let data;
// //       try {
// //         data = JSON.parse(text);
// //       } catch (err) {
// //         if (!res.ok)
// //           throw new Error(`HTTP ${res.status}: ${text.substring(0, 200)}`);
// //         throw new Error(`JSON parse error: ${text.substring(0, 200)}`);
// //       }
// //       if (!res.ok)
// //         throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
// //       return data;
// //     } finally {
// //       clearTimeout(timeoutId);
// //     }
// //   })();
// // }

// // async function fetchOrderBookDetails() {
// //   const url = `${config.lighter.baseUrl}/api/v1/orderBookDetails?filter=perp`;
// //   return getJsonWithTimeout(url);
// // }

// // async function fetchFundingRates() {
// //   const url = `${config.lighter.baseUrl}/api/v1/funding-rates`;
// //   return getJsonWithTimeout(url);
// // }

// // function fetchMarketStatsViaWS() {
// //   return new Promise((resolve, reject) => {
// //     const WebSocket = require("ws");
// //     const ws = new WebSocket(config.lighter.wsUrl);
// //     const timeout = setTimeout(() => {
// //       ws.close();
// //       reject(new Error("WebSocket market_stats timeout"));
// //     }, 15000);

// //     ws.on("open", () => {
// //       ws.send(JSON.stringify({ type: "subscribe", channel: "market_stats/all" }));
// //     });

// //     ws.on("message", (raw) => {
// //       try {
// //         const msg = JSON.parse(raw.toString());
// //         if (msg.type === "update/market_stats" && msg.channel === "market_stats:all") {
// //           clearTimeout(timeout);
// //           ws.close();
// //           resolve(msg);
// //         }
// //       } catch (err) {
// //         logger.warn(`WS parse error: ${err.message}`);
// //       }
// //     });

// //     ws.on("error", (err) => {
// //       clearTimeout(timeout);
// //       reject(err);
// //     });

// //     ws.on("close", () => clearTimeout(timeout));
// //   });
// // }

// // function randomInterval(minMs, maxMs) {
// //   return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
// // }

// // function num(v) {
// //   const n = Number(v);
// //   return Number.isFinite(n) ? n : 0;
// // }

// // /**
// //  * Check if cache needs refresh
// //  */
// // function isCacheExpired() {
// //   return !lastCacheUpdate || (Date.now() - lastCacheUpdate) > CACHE_DURATION_MS;
// // }

// // /**
// //  * Fetch icon URL for a single token from CoinGecko API
// //  */
// // async function fetchTokenIconFromAPI(symbol) {
// //   try {
// //     const url = `https://api.coingecko.com/api/v3/search?query=${symbol}`;
// //     const data = await getJsonWithTimeout(url, 5000);
    
// //     if (data.coins && data.coins.length > 0) {
// //       const coin = data.coins[0];
// //       // Return the thumb URL from the API response (matches your curl output)
// //       return coin.thumb || null;
// //     }
// //     return null;
// //   } catch (err) {
// //     logger.warn(`Failed to fetch CoinGecko icon for ${symbol}: ${err.message}`);
// //     return null;
// //   }
// // }

// // /**
// //  * Refresh the entire icon cache for all known tokens
// //  * @param {Array} tokenSymbols - List of token symbols to fetch
// //  */
// // async function refreshIconCache(tokenSymbols) {
// //   if (!tokenSymbols || tokenSymbols.length === 0) {
// //     logger.warn("No token symbols provided for cache refresh");
// //     return;
// //   }

// //   logger.info(`Refreshing icon cache for ${tokenSymbols.length} tokens...`);
  
// //   // Process tokens in batches to avoid rate limiting (CoinGecko free tier: 50 calls/min)
// //   const batchSize = 10;
// //   const delayMs = 2000; // 2 second delay between batches
  
// //   for (let i = 0; i < tokenSymbols.length; i += batchSize) {
// //     const batch = tokenSymbols.slice(i, i + batchSize);
    
// //     await Promise.all(
// //       batch.map(async (symbol) => {
// //         const upperSymbol = symbol.toUpperCase().trim();
// //         const iconUrl = await fetchTokenIconFromAPI(upperSymbol);
        
// //         if (iconUrl) {
// //           iconCache.set(upperSymbol, iconUrl);
// //           logger.debug(`Cached icon for ${upperSymbol}: ${iconUrl}`);
// //         } else {
// //           // Set fallback URL
// //           iconCache.set(upperSymbol, "/hyperliquid.png");
// //           logger.warn(`No icon found for ${upperSymbol}, using fallback`);
// //         }
// //       })
// //     );
    
// //     // Delay between batches to respect rate limits
// //     if (i + batchSize < tokenSymbols.length) {
// //       await new Promise(resolve => setTimeout(resolve, delayMs));
// //     }
// //   }
  
// //   lastCacheUpdate = Date.now();
// //   logger.info(`Icon cache refreshed. Cached ${iconCache.size} tokens`);
// // }

// // /**
// //  * Get token icon URL with caching (24 hour refresh)
// //  * @param {string} symbol - Token symbol (e.g., 'CRO', 'BIO')
// //  * @param {Array} allTokens - Optional: list of all tokens for cache refresh
// //  * @returns {Promise<string>} CoinGecko image URL
// //  */
// // async function getLighterIconUrl(symbol, allTokens = null) {
// //   if (!symbol) return "/hyperliquid.png";
  
// //   const upperSymbol = symbol.toUpperCase().trim();
  
// //   // Check if cache is expired and we have tokens to refresh
// //   if (isCacheExpired() && allTokens && allTokens.length > 0) {
// //     // Trigger background refresh (don't await to avoid blocking)
// //     refreshIconCache(allTokens).catch(err => {
// //       logger.error(`Background cache refresh failed: ${err.message}`);
// //     });
// //   }
  
// //   // Return from cache if available
// //   if (iconCache.has(upperSymbol)) {
// //     return iconCache.get(upperSymbol);
// //   }
  
// //   // Not in cache, try to fetch just this one
// //   const iconUrl = await fetchTokenIconFromAPI(upperSymbol);
// //   if (iconUrl) {
// //     iconCache.set(upperSymbol, iconUrl);
// //     return iconUrl;
// //   }
  
// //   // Fallback
// //   return "/hyperliquid.png";
// // }

// // /**
// //  * Synchronous version for when you already have the cache preloaded
// //  * (Use this in performance-critical paths)
// //  */
// // function getLighterIconUrlSync(symbol) {
// //   if (!symbol) return "/hyperliquid.png";
// //   const upperSymbol = symbol.toUpperCase().trim();
// //   return iconCache.get(upperSymbol) || "/hyperliquid.png";
// // }

// // /**
// //  * Preload icons for all tokens at startup
// //  * Call this once when your app initializes
// //  */
// // async function preloadTokenIcons(tokenSymbols) {
// //   if (!tokenSymbols || tokenSymbols.length === 0) {
// //     logger.warn("No token symbols provided for preload");
// //     return;
// //   }
  
// //   if (isCacheExpired() || iconCache.size === 0) {
// //     await refreshIconCache(tokenSymbols);
// //   }
// // }

// // module.exports = {
// //   fetchOrderBookDetails,
// //   fetchFundingRates,
// //   fetchMarketStatsViaWS,
// //   randomInterval,
// //   num,
// //   getLighterIconUrl,      // Async version with auto-refresh
// //   getLighterIconUrlSync,  // Sync version (fast, requires preload)
// //   preloadTokenIcons,      // Call this at startup
// //   refreshIconCache,       // Manual refresh if needed
// // };



// "use strict";

// const config = require("../config");
// const logger = require("./logger");

// // In-memory cache for token icons (clears on server restart)
// const iconCache = new Map();
// let lastCacheUpdate = null;
// const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// function getJsonWithTimeout(url, timeout = 8000) {
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), timeout);

//   return (async () => {
//     try {
//       const res = await fetch(url, {
//         headers: { Accept: "application/json" },
//         signal: controller.signal,
//       });
//       const text = await res.text();
//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch (err) {
//         if (!res.ok)
//           throw new Error(`HTTP ${res.status}: ${text.substring(0, 200)}`);
//         throw new Error(`JSON parse error: ${text.substring(0, 200)}`);
//       }
//       if (!res.ok)
//         throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
//       return data;
//     } finally {
//       clearTimeout(timeoutId);
//     }
//   })();
// }

// async function fetchOrderBookDetails() {
//   const url = `${config.lighter.baseUrl}/api/v1/orderBookDetails?filter=perp`;
//   return getJsonWithTimeout(url);
// }

// async function fetchFundingRates() {
//   const url = `${config.lighter.baseUrl}/api/v1/funding-rates`;
//   return getJsonWithTimeout(url);
// }

// function fetchMarketStatsViaWS() {
//   return new Promise((resolve, reject) => {
//     const WebSocket = require("ws");
//     const ws = new WebSocket(config.lighter.wsUrl);
//     const timeout = setTimeout(() => {
//       ws.close();
//       reject(new Error("WebSocket market_stats timeout"));
//     }, 15000);

//     ws.on("open", () => {
//       ws.send(JSON.stringify({ type: "subscribe", channel: "market_stats/all" }));
//     });

//     ws.on("message", (raw) => {
//       try {
//         const msg = JSON.parse(raw.toString());
//         if (msg.type === "update/market_stats" && msg.channel === "market_stats:all") {
//           clearTimeout(timeout);
//           ws.close();
//           resolve(msg);
//         }
//       } catch (err) {
//         logger.warn(`WS parse error: ${err.message}`);
//       }
//     });

//     ws.on("error", (err) => {
//       clearTimeout(timeout);
//       reject(err);
//     });

//     ws.on("close", () => clearTimeout(timeout));
//   });
// }

// function randomInterval(minMs, maxMs) {
//   return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
// }

// function num(v) {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : 0;
// }

// /**
//  * Check if cache needs refresh
//  */
// function isCacheExpired() {
//   return !lastCacheUpdate || (Date.now() - lastCacheUpdate) > CACHE_DURATION_MS;
// }

// /**
//  * Fetch all token logos from Aster API
//  */
// async function fetchAsterLogos() {
//   try {
//     const asterLogoUrl = "https://www.asterdex.com/bapi/futures/v1/public/future/asset/ae/all-asset-logo";
    
//     const response = await fetch(asterLogoUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({}),
//     });

//     const data = await response.json();
//     const list = data?.data;
    
//     const isValid = Array.isArray(list) && (data.success === true || data.code === "000000");
    
//     if (isValid) {
//       logger.info(`Fetched ${list.length} token logos from Aster API`);
//       return list;
//     } else {
//       logger.warn("Invalid response from Aster logos API");
//       return null;
//     }
//   } catch (err) {
//     logger.warn(`Failed to fetch Aster logos: ${err.message}`);
//     return null;
//   }
// }

// /**
//  * Refresh the entire icon cache using Aster API
//  * @param {Array} tokenSymbols - List of token symbols to fetch (optional, Aster API returns all)
//  */
// async function refreshIconCache(tokenSymbols = null) {
//   logger.info("Refreshing icon cache from Aster API...");
  
//   try {
//     // Fetch all logos from Aster API
//     const asterLogos = await fetchAsterLogos();
    
//     if (asterLogos && asterLogos.length > 0) {
//       // Clear existing cache
//       iconCache.clear();
      
//       // Populate cache with Aster logos
//       for (const asset of asterLogos) {
//         if (asset.assetCode && asset.logoUrl) {
//           const symbol = asset.assetCode.toUpperCase().trim();
//           iconCache.set(symbol, asset.logoUrl);
//           logger.debug(`Cached icon for ${symbol}: ${asset.logoUrl}`);
//         }
//       }
      
//       lastCacheUpdate = Date.now();
//       logger.info(`Icon cache refreshed from Aster API. Cached ${iconCache.size} tokens`);
//       return;
//     }
    
//     // Fallback to CoinGecko if Aster API fails and specific symbols provided
//     if (tokenSymbols && tokenSymbols.length > 0) {
//       logger.warn("Aster API failed, falling back to CoinGecko API");
//       await refreshIconCacheFromCoinGecko(tokenSymbols);
//     } else {
//       logger.warn("No fallback token symbols provided");
//     }
//   } catch (err) {
//     logger.error(`Failed to refresh icon cache: ${err.message}`);
    
//     // Fallback to CoinGecko
//     if (tokenSymbols && tokenSymbols.length > 0) {
//       await refreshIconCacheFromCoinGecko(tokenSymbols);
//     }
//   }
// }

// /**
//  * Fallback: Refresh cache using CoinGecko API
//  */
// async function refreshIconCacheFromCoinGecko(tokenSymbols) {
//   if (!tokenSymbols || tokenSymbols.length === 0) {
//     logger.warn("No token symbols provided for CoinGecko fallback");
//     return;
//   }

//   logger.info(`Falling back to CoinGecko for ${tokenSymbols.length} tokens...`);
  
//   // Process tokens in batches to avoid rate limiting (CoinGecko free tier: 50 calls/min)
//   const batchSize = 10;
//   const delayMs = 2000; // 2 second delay between batches
  
//   for (let i = 0; i < tokenSymbols.length; i += batchSize) {
//     const batch = tokenSymbols.slice(i, i + batchSize);
    
//     await Promise.all(
//       batch.map(async (symbol) => {
//         const upperSymbol = symbol.toUpperCase().trim();
        
//         // Skip if already in cache from Aster
//         if (iconCache.has(upperSymbol)) return;
        
//         try {
//           const url = `https://api.coingecko.com/api/v3/search?query=${upperSymbol}`;
//           const data = await getJsonWithTimeout(url, 5000);
          
//           if (data.coins && data.coins.length > 0) {
//             const coin = data.coins[0];
//             const iconUrl = coin.thumb || null;
            
//             if (iconUrl) {
//               iconCache.set(upperSymbol, iconUrl);
//               logger.debug(`Cached icon for ${upperSymbol} from CoinGecko: ${iconUrl}`);
//             } else {
//               iconCache.set(upperSymbol, "/hyperliquid.png");
//               logger.warn(`No icon found for ${upperSymbol} from CoinGecko, using fallback`);
//             }
//           } else {
//             iconCache.set(upperSymbol, "/hyperliquid.png");
//             logger.warn(`No CoinGecko data for ${upperSymbol}, using fallback`);
//           }
//         } catch (err) {
//           logger.warn(`Failed to fetch CoinGecko icon for ${upperSymbol}: ${err.message}`);
//           iconCache.set(upperSymbol, "/hyperliquid.png");
//         }
//       })
//     );
    
//     // Delay between batches to respect rate limits
//     if (i + batchSize < tokenSymbols.length) {
//       await new Promise(resolve => setTimeout(resolve, delayMs));
//     }
//   }
  
//   if (!lastCacheUpdate) {
//     lastCacheUpdate = Date.now();
//   }
//   logger.info(`CoinGecko fallback completed. Cached ${iconCache.size} tokens total`);
// }

// /**
//  * Get token icon URL with caching (24 hour refresh)
//  * @param {string} symbol - Token symbol (e.g., 'CRO', 'BIO')
//  * @returns {Promise<string>} Icon URL
//  */
// async function getLighterIconUrl(symbol) {
//   if (!symbol) return "/hyperliquid.png";
  
//   const upperSymbol = symbol.toUpperCase().trim();
  
//   // Return from cache if available
//   if (iconCache.has(upperSymbol)) {
//     return iconCache.get(upperSymbol);
//   }
  
//   // Not in cache, try to fetch from Aster API (single lookup)
//   try {
//     const asterLogos = await fetchAsterLogos();
//     if (asterLogos) {
//       for (const asset of asterLogos) {
//         if (asset.assetCode && asset.assetCode.toUpperCase().trim() === upperSymbol) {
//           const iconUrl = asset.logoUrl;
//           iconCache.set(upperSymbol, iconUrl);
//           return iconUrl;
//         }
//       }
//     }
//   } catch (err) {
//     logger.warn(`Failed to fetch specific icon for ${upperSymbol} from Aster: ${err.message}`);
//   }
  
//   // Fallback
//   iconCache.set(upperSymbol, "/hyperliquid.png");
//   return "/hyperliquid.png";
// }

// /**
//  * Synchronous version for when you already have the cache preloaded
//  * (Use this in performance-critical paths)
//  */
// function getLighterIconUrlSync(symbol) {
//   if (!symbol) return "/hyperliquid.png";
//   const upperSymbol = symbol.toUpperCase().trim();
//   return iconCache.get(upperSymbol) || "/hyperliquid.png";
// }

// /**
//  * Preload icons for all tokens at startup
//  * Call this once when your app initializes
//  */
// async function preloadTokenIcons(tokenSymbols = null) {
//   if (isCacheExpired() || iconCache.size === 0) {
//     logger.info("Preloading token icons from Aster API...");
//     await refreshIconCache(tokenSymbols);
//   } else {
//     logger.info(`Icon cache already valid with ${iconCache.size} tokens, skipping preload`);
//   }
// }

// // Optional: Schedule automatic refresh every 24 hours
// let refreshInterval = null;

// function startAutoRefresh(tokenSymbols = null) {
//   if (refreshInterval) clearInterval(refreshInterval);
  
//   refreshInterval = setInterval(async () => {
//     logger.info("Auto-refreshing icon cache (24 hours elapsed)");
//     await refreshIconCache(tokenSymbols);
//   }, CACHE_DURATION_MS);
  
//   logger.info("Auto-refresh scheduled every 24 hours");
// }

// function stopAutoRefresh() {
//   if (refreshInterval) {
//     clearInterval(refreshInterval);
//     refreshInterval = null;
//     logger.info("Auto-refresh stopped");
//   }
// }

// module.exports = {
//   fetchOrderBookDetails,
//   fetchFundingRates,
//   fetchMarketStatsViaWS,
//   randomInterval,
//   num,
//   getLighterIconUrl,      // Async version
//   getLighterIconUrlSync,  // Sync version (fast, requires preload)
//   preloadTokenIcons,      // Call this at startup
//   refreshIconCache,       // Manual refresh if needed
//   startAutoRefresh,       // Optional: auto-refresh every 24h
//   stopAutoRefresh,        // Stop auto-refresh
// };


"use strict";

const config = require("../config");
const logger = require("./logger");

// In-memory cache for token icons (clears on server restart)
const iconCache = new Map();
let lastCacheUpdate = null;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function getJsonWithTimeout(url, timeout = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return (async () => {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        if (!res.ok)
          throw new Error(`HTTP ${res.status}: ${text.substring(0, 200)}`);
        throw new Error(`JSON parse error: ${text.substring(0, 200)}`);
      }
      if (!res.ok)
        throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
      return data;
    } finally {
      clearTimeout(timeoutId);
    }
  })();
}

async function fetchOrderBookDetails() {
  const url = `${config.lighter.baseUrl}/api/v1/orderBookDetails?filter=perp`;
  return getJsonWithTimeout(url);
}

async function fetchFundingRates() {
  const url = `${config.lighter.baseUrl}/api/v1/funding-rates`;
  return getJsonWithTimeout(url);
}

async function fetchTokenlist() {
  const url = `${config.lighter.baseUrl}/api/v1/tokenlist`;
  return getJsonWithTimeout(url);
}

function fetchMarketStatsViaWS() {
  return new Promise((resolve, reject) => {
    const WebSocket = require("ws");
    const ws = new WebSocket(config.lighter.wsUrl);
    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error("WebSocket market_stats timeout"));
    }, 15000);

    ws.on("open", () => {
      ws.send(JSON.stringify({ type: "subscribe", channel: "market_stats/all" }));
    });

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "update/market_stats" && msg.channel === "market_stats:all") {
          clearTimeout(timeout);
          ws.close();
          resolve(msg);
        }
      } catch (err) {
        logger.warn(`WS parse error: ${err.message}`);
      }
    });

    ws.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    ws.on("close", () => clearTimeout(timeout));
  });
}

function randomInterval(minMs, maxMs) {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Check if cache needs refresh
 */
function isCacheExpired() {
  return !lastCacheUpdate || (Date.now() - lastCacheUpdate) > CACHE_DURATION_MS;
}

/**
 * Fetch all token logos from Aster API
 */
async function fetchAsterLogos() {
  try {
    const asterLogoUrl = "https://www.asterdex.com/bapi/futures/v1/public/future/asset/ae/all-asset-logo";
    
    const response = await fetch(asterLogoUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    const list = data?.data;
    
    const isValid = Array.isArray(list) && (data.success === true || data.code === "000000");
    
    if (isValid) {
      return list;
    } else {
      logger.warn("Invalid response from Aster logos API");
      return null;
    }
  } catch (err) {
    logger.warn(`Failed to fetch Aster logos: ${err.message}`);
    return null;
  }
}

/**
 * Refresh the entire icon cache using Aster API
 * @param {Array} tokenSymbols - List of token symbols to fetch (optional, Aster API returns all)
 */
async function refreshIconCache(tokenSymbols = null) {
  logger.info("Refreshing icon cache from Aster API...");
  
  try {
    // Fetch all logos from Aster API
    const asterLogos = await fetchAsterLogos();
    
    if (asterLogos && asterLogos.length > 0) {
      // Clear existing cache
      iconCache.clear();
      
      // Populate cache with Aster logos
      let cachedCount = 0;
      for (const asset of asterLogos) {
        if (asset.assetCode && asset.logoUrl) {
          const symbol = asset.assetCode.toUpperCase().trim();
          iconCache.set(symbol, asset.logoUrl);
          cachedCount++;
        }
      }
      
      lastCacheUpdate = Date.now();
      logger.info(`Icon cache refreshed from Aster API. Cached ${cachedCount} tokens`);
      return;
    }
    
    // Fallback to CoinGecko if Aster API fails and specific symbols provided
    if (tokenSymbols && tokenSymbols.length > 0) {
      logger.warn("Aster API failed, falling back to CoinGecko API");
      await refreshIconCacheFromCoinGecko(tokenSymbols);
    } else {
      logger.warn("No fallback token symbols provided");
    }
  } catch (err) {
    logger.error(`Failed to refresh icon cache: ${err.message}`);
    
    // Fallback to CoinGecko
    if (tokenSymbols && tokenSymbols.length > 0) {
      await refreshIconCacheFromCoinGecko(tokenSymbols);
    }
  }
}

/**
 * Fallback: Refresh cache using CoinGecko API
 */
async function refreshIconCacheFromCoinGecko(tokenSymbols) {
  if (!tokenSymbols || tokenSymbols.length === 0) {
    logger.warn("No token symbols provided for CoinGecko fallback");
    return;
  }

  logger.info(`Falling back to CoinGecko for ${tokenSymbols.length} tokens...`);
  
  // Process tokens in batches to avoid rate limiting (CoinGecko free tier: 50 calls/min)
  const batchSize = 5; // Reduced from 10 to avoid rate limits
  const delayMs = 3000; // Increased delay to 3 seconds
  
  let successCount = 0;
  
  for (let i = 0; i < tokenSymbols.length; i += batchSize) {
    const batch = tokenSymbols.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (symbol) => {
        const upperSymbol = symbol.toUpperCase().trim();
        
        // Skip if already in cache from Aster
        if (iconCache.has(upperSymbol)) return;
        
        try {
          const url = `https://api.coingecko.com/api/v3/search?query=${upperSymbol}`;
          const data = await getJsonWithTimeout(url, 5000);
          
          if (data.coins && data.coins.length > 0) {
            const coin = data.coins[0];
            const iconUrl = coin.thumb || null;
            
            if (iconUrl) {
              iconCache.set(upperSymbol, iconUrl);
              successCount++;
            } else {
              iconCache.set(upperSymbol, "/hyperliquid.png");
            }
          } else {
            iconCache.set(upperSymbol, "/hyperliquid.png");
          }
        } catch (err) {
          // Silent fail for individual tokens
          iconCache.set(upperSymbol, "/hyperliquid.png");
        }
      })
    );
    
    // Delay between batches to respect rate limits
    if (i + batchSize < tokenSymbols.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  if (!lastCacheUpdate) {
    lastCacheUpdate = Date.now();
  }
  logger.info(`CoinGecko fallback completed. Cached ${successCount} new tokens from CoinGecko`);
}

/**
 * Get token icon URL with caching (24 hour refresh)
 * @param {string} symbol - Token symbol (e.g., 'CRO', 'BIO')
 * @returns {Promise<string>} Icon URL
 */
async function getLighterIconUrl(symbol) {
  if (!symbol) return "/hyperliquid.png";
  
  const upperSymbol = symbol.toUpperCase().trim();
  
  // Return from cache if available
  if (iconCache.has(upperSymbol)) {
    return iconCache.get(upperSymbol);
  }
  
  // Not in cache, try to fetch from Aster API (single lookup)
  try {
    const asterLogos = await fetchAsterLogos();
    if (asterLogos) {
      for (const asset of asterLogos) {
        if (asset.assetCode && asset.assetCode.toUpperCase().trim() === upperSymbol) {
          const iconUrl = asset.logoUrl;
          iconCache.set(upperSymbol, iconUrl);
          return iconUrl;
        }
      }
    }
  } catch (err) {
    // Silent fail
  }
  
  // Fallback
  iconCache.set(upperSymbol, "/hyperliquid.png");
  return "/hyperliquid.png";
}

/**
 * Synchronous version for when you already have the cache preloaded
 */
function getLighterIconUrlSync(symbol) {
  if (!symbol) return "/hyperliquid.png";
  const upperSymbol = symbol.toUpperCase().trim();
  return iconCache.get(upperSymbol) || "/hyperliquid.png";
}

/**
 * Preload icons for all tokens at startup
 */
async function preloadTokenIcons(tokenSymbols = null) {
  if (isCacheExpired() || iconCache.size === 0) {
    logger.info("Preloading token icons from Aster API...");
    await refreshIconCache(tokenSymbols);
  } else {
    logger.info(`Icon cache already valid with ${iconCache.size} tokens, skipping preload`);
  }
}

module.exports = {
  fetchOrderBookDetails,
  fetchFundingRates,
  fetchTokenlist,
  fetchMarketStatsViaWS,
  randomInterval,
  num,
  getLighterIconUrl,
  getLighterIconUrlSync,
  preloadTokenIcons,
  refreshIconCache,
};