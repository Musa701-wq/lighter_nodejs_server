"use strict";

const { fetchTokenlist } = require("./lighterHelpers");
const { getCategories } = require("../config/lighterCategories");

const TOKENLIST_URL = "https://mainnet.zklighter.elliot.ai/api/v1/tokenlist";
const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;

const CATEGORY_MAP = {
  LAYER_1: "layer1",
  LAYER_2: "layer2",
  MAJOR: "majors",
  MEMES: "memes",
  AI: "ai",
  DEFI: "defi",
  COMMODITIES: "commodities",
  FX: "fx",
  KRW: "krw",
  EQUITIES: "equities",
  STOCK: "equities",
  ETF: "etf/index",
  ETF_INDEX: "etf/index",
  ETFINDEX: "etf/index",
  NEW: "new",
  UPCOMING: "upcoming",
  PRECIP: "pre ipo",
  PRE_IPO: "pre ipo",
  PIPO: "pre ipo",
  COMPUTE: "compute",
  RWA: "rwa",
};

let tokenMap = null;
let lastRefresh = null;
const warnedSymbols = new Set();

async function loadTokenMetadata() {
  if (tokenMap && lastRefresh && Date.now() - lastRefresh < REFRESH_INTERVAL_MS) {
    return tokenMap;
  }
  try {
    const res = await fetchTokenlist();
    if (!res || res.code !== 200 || !Array.isArray(res.tokens)) {
      throw new Error("Invalid tokenlist response");
    }
    const map = new Map();
    for (const token of res.tokens) {
      if (!token.symbol) continue;
      const meta = buildMetadata(token);
      const key = token.symbol.toUpperCase().trim();
      map.set(key, meta);
      const base = key.split("/")[0];
      if (base !== key) map.set(base, meta);
      map.set(key.toLowerCase(), meta);
    }
    tokenMap = map;
    lastRefresh = Date.now();
    warnedSymbols.clear();
    console.log(`Loaded token metadata for ${map.size} entries`);
    return map;
  } catch (err) {
    console.error(`Failed to load token metadata: ${err.message}`);
    return tokenMap || new Map();
  }
}

function buildMetadata(token) {
  const categories = (token.categories || [])
    .map((c) => {
      const upper = String(c).toUpperCase().trim();
      return CATEGORY_MAP[upper] || upper.toLowerCase();
    })
    .filter((c) => c);
  return {
    categories,
    market: token.market || null,
    assetType: token.asset_type || "CRYPTO",
    name: token.name || null,
    logo: token.logo || null,
  };
}

function lookupMetadata(symbol) {
  if (!symbol) return null;
  const key = symbol.toUpperCase().trim();
  if (tokenMap && tokenMap.has(key)) return tokenMap.get(key);
  const base = key.split("/")[0];
  if (base !== key && tokenMap && tokenMap.has(base)) return tokenMap.get(base);
  return null;
}

function getCategoriesForSymbol(symbol) {
  const meta = lookupMetadata(symbol);
  if (meta) return meta.categories;
  const fallback = getCategories(symbol);
  if (fallback && fallback.length > 0) return fallback;
  return [];
}

function normalizeSymbol(symbol) {
  const upper = String(symbol || "").toUpperCase().trim();
  if (upper.startsWith("1000") && upper.length > 4) {
    return upper.slice(4);
  }
  return upper;
}

const HARDCODED_META = {
  "1000SHIB": { market: "PERPS", assetType: "CRYPTO", name: "Shiba Inu", logo: null },
  "1000PEPE": { market: "PERPS", assetType: "CRYPTO", name: "Pepe", logo: null },
  "1000BONK": { market: "PERPS", assetType: "CRYPTO", name: "Bonk", logo: null },
  "1000FLOKI": { market: "PERPS", assetType: "CRYPTO", name: "Floki", logo: null },
  "1000NOT": { market: "PERPS", assetType: "CRYPTO", name: "Notcoin", logo: null },
};

function getHardcodedMeta(symbol) {
  const upper = String(symbol || "").toUpperCase().trim();
  return HARDCODED_META[upper] || null;
}

function getTokenMetadata(symbol) {
  const meta = lookupMetadata(symbol);
  if (meta) return meta;

  const normalized = normalizeSymbol(symbol);
  if (normalized !== symbol && lookupMetadata(normalized)) {
    const baseMeta = lookupMetadata(normalized);
    return { ...baseMeta, name: baseMeta.name || symbol };
  }

  const hardcoded = getHardcodedMeta(symbol);
  if (hardcoded) {
    const categories = getCategoriesForSymbol(symbol);
    return { ...hardcoded, categories, market: hardcoded.market, assetType: hardcoded.assetType, name: hardcoded.name, logo: hardcoded.logo };
  }

  if (!warnedSymbols.has(symbol)) {
    warnedSymbols.add(symbol);
    console.warn(`No tokenlist metadata for: ${symbol}, using hardcoded fallback`);
  }
  return null;
}

function isMetadataLoaded() {
  return tokenMap !== null;
}

module.exports = {
  loadTokenMetadata,
  getTokenMetadata,
  getCategoriesForSymbol,
  lookupMetadata,
  isMetadataLoaded,
};