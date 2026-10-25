# Lighter Server APIs Documentation

## Base URL
- `http://<host>:4133`
- Configurable via `PORT` in `.env`

---

## REST Endpoints

### GET /health
Server health check.

**Response** `200 OK`
```json
{ "status": "ok" }
```

---

### GET /api/all
Returns all lighter perpetual markets, sorted by 24h volume descending.

**Query Parameters**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | number | 200 | Max records to return |
| `skip` | number | 0 | Records to skip (pagination) |
| `category` | string | — | Filter by category (comma-separated for multiple, e.g. `memes,ai`) |

**Response** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "dex": "lighter",
      "symbol": "BTC",
      "fullSymbol": "lighter:BTC",
      "displayName": "BTC",
      "categories": ["majors", "layer1"],
      "markPrice": 74131.0,
      "change24hPct": -0.0372,
      "funding8hPct": -0.0019,
      "volume24hUSD": 2122157964.34,
      "openInterestQty": 78881597.78,
      "openInterestUSD": 5847623456789.0,
      "openInterestDisplayUSD": 5847623456789.0,
      "iconUrl": "https://bin.bnbstatic.com/static/assets/logos/BTC.png",
      "updatedAt": "2026-05-18T12:00:00.000Z"
    }
  ]
}
```

**Examples**
```
GET /api/all
GET /api/all?limit=50
GET /api/all?limit=10&skip=20
GET /api/all?category=memes
GET /api/all?category=layer1,ai
```

---

### GET /api/category/:category
Returns markets filtered by one or more categories.

**Path Parameters**
| Name | Type | Description |
|------|------|-------------|
| `category` | string | Category name(s). Comma-separated for multiple (OR logic) |

**Query Parameters**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | number | 200 | Max records to return |
| `skip` | number | 0 | Records to skip |

**Valid categories**: `majors`, `layer1`, `layer2`, `memes`, `ai`, `equities`, `etf/index`, `FX`, `KRW`, `commodities`, `pre ipo`, `other`

**Response** `200 OK`
```json
{
  "success": true,
  "data": [ ... ]
}
```

**Examples**
```
GET /api/category/memes
GET /api/category/layer1,ai
GET /api/category/equities?limit=5
```

---

### GET /api/symbol/:symbol
Returns a single market by symbol.

**Path Parameters**
| Name | Type | Description |
|------|------|-------------|
| `symbol` | string | Market symbol (case-insensitive) |

**Response** `200 OK`
```json
{
  "success": true,
  "data": { ... }
}
```

**Response** `404 Not Found`
```json
{
  "success": false,
  "error": "Symbol not found"
}
```

**Examples**
```
GET /api/symbol/BTC
GET /api/symbol/eth
GET /api/symbol/1000PEPE
```

---

### GET /api/categories
Returns a count of markets per category.

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "other": 76,
    "equities": 18,
    "layer1": 17,
    "pre ipo": 12,
    "memes": 10,
    "commodities": 9,
    "etf/index": 9,
    "FX": 7,
    "ai": 5,
    "majors": 4,
    "layer2": 4,
    "KRW": 1
  }
}
```

---

---

## Dashboard Endpoints

### GET /api/dashboard/volume
Returns 24h trading volume summary with top contributors.

**Query Parameters**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | number | 5 | Number of top contributors to return |

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalVolume": 1560000000,
    "avgVolumePerMarket": 2220000,
    "mostActive": { "symbol": "BTC", "percentage": "58.40" },
    "totalMarkets": 200,
    "topContributors": [
      { "symbol": "BTC", "iconUrl": "...", "volume24hUSD": 913280000, "percentage": "58.40" },
      { "symbol": "ETH", "iconUrl": "...", "volume24hUSD": 318740000, "percentage": "20.43" }
    ],
    "updatedAt": "2026-07-31T12:00:00.000Z"
  }
}
```

---

### GET /api/dashboard/open-interest
Returns total open interest and highest OI markets.

**Query Parameters**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | number | 5 | Number of top OI markets to return |

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalOpenInterestUSD": 988470000,
    "totalMarkets": 200,
    "highestOIMarkets": [
      { "symbol": "BTC", "iconUrl": "...", "openInterestUSD": 414060000, "openInterestQty": 78881, "markPrice": 74131, "percentage": "41.90" }
    ],
    "updatedAt": "2026-07-31T12:00:00.000Z"
  }
}
```

---

### GET /api/dashboard/funding-rates
Returns funding rates analysis with top positive/negative rates.

**Query Parameters**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | number | 5 | Number of top positive/negative to return |

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "avgRate": 0.00225,
    "positiveCount": 356,
    "negativeCount": 91,
    "zeroCount": 88,
    "totalMarkets": 535,
    "topPositive": [
      { "symbol": "MINIMAX", "iconUrl": "...", "funding8hPct": 0.04004 }
    ],
    "topNegative": [
      { "symbol": "CXMT", "iconUrl": "...", "funding8hPct": -0.05897 }
    ],
    "updatedAt": "2026-07-31T12:00:00.000Z"
  }
}
```

---

### GET /api/dashboard/top-movers
Returns top gainers and losers in 24h.

**Query Parameters**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | number | 3 | Number of top gainers/losers to return |

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "gainers": [
      { "symbol": "KOMA", "iconUrl": "...", "change24hPct": 103.98, "markPrice": 0.0234 }
    ],
    "losers": [
      { "symbol": "BANK", "iconUrl": "...", "change24hPct": -52.83, "markPrice": 0.0012 }
    ],
    "updatedAt": "2026-07-31T12:00:00.000Z"
  }
}
```

---

### GET /api/dashboard/meta

Returns all distinct filterable values for categories, market types, and asset types dynamically from the database. Use this to populate filter dropdowns on the frontend so they stay in sync with the actual data.

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "categories": [
      "FX", "KRW", "ai", "commodities", "equities",
      "etf/index", "layer1", "layer2", "majors", "memes",
      "other", "pre ipo"
    ],
    "markets": ["PERPS", "SPOT"],
    "assetTypes": ["CRYPTO", "RWA"],
    "updatedAt": "2026-08-04T10:15:16.992Z"
  },
  "cached": false
}
```

**`data` fields**
| Field | Type | Description |
|-------|------|-------------|
| `categories` | string[] | All distinct category tags currently present in the orderbook (dynamic, changes as tokens are added/removed) |
| `markets` | string[] | All distinct market types (`PERPS`, `SPOT`) |
| `assetTypes` | string[] | All distinct asset types (`CRYPTO`, `RWA`) |
| `updatedAt` | string | ISO timestamp |

> The categories list is fully dynamic — it reflects whatever category tags are currently stored in the database. When new tokens with new categories (e.g. `defi`, `compute`, `rwa`) appear in the orderbook, they automatically show up here. No hardcoded list needed on the frontend.

---

## Perps Analytics Endpoints

These 3 endpoints power the perps analytics cards on the frontend (sector performance, squeeze score, funding rates).

**Base path:** `/api/perps`

### Common Conventions (read this first)

| Convention | Description |
|------------|-------------|
| `dex` query param | Scopes results to a DEX. Accepted values: `lighter`, `aster`. Any other/omitted value falls back to `lighter`. |
| Response envelope | Every response is `{ success: true, data: { ... } }`. Read `json.data` on the client. |
| `cached` flag | Top-level boolean `cached: true` when served from the in-memory cache, `false` on a fresh computation. Client can ignore it, or use it for a "stale/updated" indicator. |
| Caching | All 3 endpoints cache results in-memory for **3 minutes** (keyed per `dex`). Data is NOT real-time; poll or refetch at most every ~30s. |
| Data source | 100% real data computed from the Lighter orderbook + tokenlist + funding APIs (persisted in MongoDB). No dummy data. |
| Percentages | `change24hPct` and `funding8hPct` are **decimal ratios**, not percent numbers. `0.033` means `+3.3%`. `0.000032` means `0.0032%`. To display as percent, multiply by 100. |
| Errors | On failure the server returns an error envelope: `{ "success": false, "error": "<message>" }` with an appropriate HTTP status. |

---

### GET /api/perps/sector-performance

Aggregates all active perp markets into **sectors** (categories) with volume, open interest and average 24h change. Sectors are sorted by `volume24hUSD` descending. A market can appear in multiple sectors if it has multiple category tags (a coin tagged `layer1` + `majors` is counted in both).

**Query Parameters**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `dex` | string | `lighter` | DEX to analyze: `lighter` or `aster` |

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalCoins": 188,
    "totalSectorCoins": 202,
    "totalVolume24hUSD": 799622217.96,
    "totalOpenInterestUSD": 425984627.45,
    "bestSector": { "name": "FX", "change24hPct": 0.033 },
    "worstSector": { "name": "ai", "change24hPct": -1.883 },
    "positiveSectors": 1,
    "totalSectors": 12,
    "sectors": [
      {
        "name": "majors",
        "avgChange24hPct": -0.802,
        "volume24hUSD": 711106536.14,
        "volumePct": 88.93,
        "openInterestUSD": 254781477.41,
        "coinCount": 10
      },
      {
        "name": "layer1",
        "avgChange24hPct": -0.391,
        "volume24hUSD": 682846412.06,
        "volumePct": 85.4,
        "openInterestUSD": 270298145.22,
        "coinCount": 34
      }
    ],
    "updatedAt": "2026-08-04T06:35:21.710Z"
  },
  "cached": false
}
```

**Data fields**
| Field | Type | Description |
|-------|------|-------------|
| `totalCoins` | number | Count of distinct markets analyzed (may be less than `totalSectorCoins` because coins with multiple tags are counted once per tag) |
| `totalSectorCoins` | number | Sum of `coinCount` across all sectors |
| `totalVolume24hUSD` | number | Total 24h volume across all markets |
| `totalOpenInterestUSD` | number | Total open interest across all markets |
| `bestSector` | object \| `null` | Sector with the highest `avgChange24hPct` (highest 24h gain) |
| `worstSector` | object \| `null` | Sector with the lowest `avgChange24hPct` (biggest 24h loss) |
| `positiveSectors` | number | How many sectors have `avgChange24hPct > 0` |
| `totalSectors` | number | Total number of sectors present |
| `sectors` | Sector[] | Per-sector stats, sorted by volume desc |
| `updatedAt` | string | ISO timestamp of when the data was computed |

**`sectors[]` item**
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Category/sector name (e.g. `majors`, `layer1`, `ai`, `memes`, `equities`, `etf/index`, `FX`, `KRW`, `commodities`, `pre ipo`, `layer2`, `other`) |
| `avgChange24hPct` | number | Mean 24h change of coins in this sector (decimal ratio, 3dp). Multiply by 100 to show as % |
| `volume24hUSD` | number | Total 24h volume of the sector |
| `volumePct` | number | Sector's share of total volume, `0-100` (already a percent number). Sums can exceed 100 because multi-tag coins are counted per sector |
| `openInterestUSD` | number | Total open interest of the sector |
| `coinCount` | number | Number of coins carrying this category tag |

---

### GET /api/perps/squeeze-score

Ranks every market on a **squeeze score 0-100** derived from funding rate and 24h momentum, then buckets markets into 4 risk tiers. Each bucket is sorted by `score` descending.

**Query Parameters**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `dex` | string | `lighter` | DEX to analyze: `lighter` or `aster` |

**Score methodology (for reference)**
- For the returned dataset the server computes the max absolute `funding8hPct` and max absolute `change24hPct`.
- Each market's funding magnitude and momentum magnitude are normalized to `0-100` against those maxes, then combined: `score = round(fundingScore * 0.6 + momentumScore * 0.4)`.
- A higher score = higher squeeze risk (strong positive or negative funding + strong price move).

**Risk tiers**
| Bucket | Score range | Meaning |
|--------|-------------|---------|
| `highRisk` | 70-100 | Extreme squeeze risk |
| `mediumRisk` | 40-69 | Elevated squeeze risk |
| `lowRisk` | 20-39 | Moderate risk |
| `minimalRisk` | 0-19 | Low risk |

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "highRisk": [],
    "mediumRisk": [
      { "symbol": "H100", "iconUrl": "/hyperliquid.png", "score": 64 },
      { "symbol": "KAITO", "iconUrl": "https://static.astherus.finance/image/admin_mgs_image_upload/20260430/498f2686-6bff-45a2-b325-381554b9fbdc.png", "score": 42 }
    ],
    "lowRisk": [
      { "symbol": "SKR", "iconUrl": "https://static.astherus.finance/image/admin_mgs_image_upload/20260122/1eaa3b61-0d31-413a-bf29-f205523fa807.png", "score": 39 },
      { "symbol": "CAP", "iconUrl": "https://static.astherus.finance/image/admin_mgs_image_upload/20260627/e5c5db82-ec3b-44f6-b343-5060bd4b984d.png", "score": 28 }
    ],
    "minimalRisk": [
      { "symbol": "BOTZ", "iconUrl": "/hyperliquid.png", "score": 18 },
      { "symbol": "DATA", "iconUrl": "/hyperliquid.png", "score": 17 }
    ],
    "updatedAt": "2026-08-04T06:35:21.710Z"
  },
  "cached": false
}
```

> Note: `minimalRisk` can be large (the current dataset has ~180 coins there). `highRisk` may be empty on a calm day — treat it as `[]` and render a "no assets" empty state. When `dex=aster` or the market has no icon, `iconUrl` falls back to `/hyperliquid.png` (serve from the server's public dir or replace client-side).

**`data` fields**
| Field | Type | Description |
|-------|------|-------------|
| `highRisk` | MarketScore[] | Score 70-100 |
| `mediumRisk` | MarketScore[] | Score 40-69 |
| `lowRisk` | MarketScore[] | Score 20-39 |
| `minimalRisk` | MarketScore[] | Score 0-19 |
| `updatedAt` | string | ISO timestamp |

**`MarketScore` item**
| Field | Type | Description |
|-------|------|-------------|
| `symbol` | string | Market symbol (e.g. `H100`, `BTC`) |
| `iconUrl` | string | Token icon URL or `/hyperliquid.png` fallback |
| `score` | number | Squeeze score 0-100 |

---

### GET /api/perps/funding-rates

Returns every market with its current 8h funding rate, sorted by `funding8hPct` **descending** (highest positive first, most negative last). Use this for a funding-rate table/heatmap or to find positive (longs pay shorts) vs negative (shorts pay longs) regimes.

**Query Parameters**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `dex` | string | `lighter` | DEX to analyze: `lighter` or `aster` |

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "rates": [
      { "symbol": "H100", "iconUrl": "/hyperliquid.png", "funding8hPct": 0.003288 },
      { "symbol": "USDKRW", "iconUrl": "/hyperliquid.png", "funding8hPct": 0.001376 },
      { "symbol": "XPD", "iconUrl": "https://static.astherus.finance/image/admin_mgs_image_upload/20260204/49fe3f51-861f-4528-81b5-684427ab95db.png", "funding8hPct": 0.00064 },
      { "symbol": "EURUSD", "iconUrl": "/hyperliquid.png", "funding8hPct": 0 },
      { "symbol": "GBPUSD", "iconUrl": "/hyperliquid.png", "funding8hPct": -0.0013 }
    ],
    "updatedAt": "2026-08-04T06:35:21.710Z"
  },
  "cached": false
}
```

**`data` fields**
| Field | Type | Description |
|-------|------|-------------|
| `rates` | FundingRate[] | All markets sorted by `funding8hPct` desc (highest positive first) |
| `updatedAt` | string | ISO timestamp |

**`FundingRate` item**
| Field | Type | Description |
|-------|------|-------------|
| `symbol` | string | Market symbol |
| `iconUrl` | string | Token icon URL or `/hyperliquid.png` fallback |
| `funding8hPct` | number | Funding rate per 8h interval (decimal ratio). Multiply by 100 to show as % (e.g. `0.003288` → `0.33%`). Negative = shorts receive funding |

---

### Frontend Integration (TypeScript)

Types + fetch helpers you can drop straight into your app.

```ts
// types.ts
export interface PerpSector {
  name: string;
  avgChange24hPct: number;   // decimal ratio, *100 to display %
  volume24hUSD: number;
  volumePct: number;          // already 0-100
  openInterestUSD: number;
  coinCount: number;
}

export interface SectorPerformance {
  totalCoins: number;
  totalSectorCoins: number;
  totalVolume24hUSD: number;
  totalOpenInterestUSD: number;
  bestSector: { name: string; change24hPct: number } | null;
  worstSector: { name: string; change24hPct: number } | null;
  positiveSectors: number;
  totalSectors: number;
  sectors: PerpSector[];
  updatedAt: string;
}

export interface SqueezeMarket {
  symbol: string;
  iconUrl: string;
  score: number; // 0-100
}

export interface SqueezeScore {
  highRisk: SqueezeMarket[];
  mediumRisk: SqueezeMarket[];
  lowRisk: SqueezeMarket[];
  minimalRisk: SqueezeMarket[];
  updatedAt: string;
}

export interface FundingRate {
  symbol: string;
  iconUrl: string;
  funding8hPct: number; // decimal ratio, *100 to display %
}

export interface FundingRates {
  rates: FundingRate[];
  updatedAt: string;
}

export interface PerpsMeta {
  categories: string[];
  markets: string[];
  assetTypes: string[];
  updatedAt: string;
}
```

```ts
// api.ts
const BASE = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Unknown API error");
  return json.data as T;
}

// Perps analytics
export const fetchSectorPerformance = (dex = "lighter") =>
  get<SectorPerformance>(`/perps/sector-performance?dex=${dex}`);

export const fetchSqueezeScore = (dex = "lighter") =>
  get<SqueezeScore>(`/perps/squeeze-score?dex=${dex}`);

export const fetchFundingRates = (dex = "lighter") =>
  get<FundingRates>(`/perps/funding-rates?dex=${dex}`);

// Dashboard meta — dynamic filter options
export const fetchPerpsMeta = () => get<PerpsMeta>("/dashboard/meta");
```

**Card adaptation tips**
- **Sector performance:** render `data.sectors` as bars — width = `volumePct`, label = `name`, value = `avgChange24hPct * 100` colored green/red on sign. Highlight `bestSector.name` / `worstSector.name` in the header stats.
- **Squeeze score:** map bucket → color (`highRisk` red, `mediumRisk` orange, `lowRisk` yellow, `minimalRisk` green). Render count per bucket and a top-N list of each bucket's first items. Buckets may be empty arrays — handle empty state.
- **Funding rates:** render top positive (green, first item of `rates`) and most negative (red, last item of `rates`). The array is pre-sorted descending, so the last element is the most negative.
- **Filter dropdowns:** call `fetchPerpsMeta()` once on app load to get the dynamic `categories`, `markets`, and `assetTypes` arrays. Use these to populate filter options — no hardcoded lists needed.

---

## WebSocket

### Connection
```
ws://<host>:4133
```

The WebSocket server is available on the same port. Clients receive live `markets_update` events after subscribing.

### Subscription Protocol

#### Subscribe to all markets
```json
{ "type": "subscribe" }
```

#### Subscribe to specific categories
```json
{ "type": "subscribe", "categories": "memes" }
{ "type": "subscribe", "categories": "layer1,ai" }
{ "type": "subscribe", "categories": "equities,etf/index" }
```

Both `categories` and `category` are accepted as the parameter name.

#### Unsubscribe (reset to all)
```json
{ "type": "unsubscribe" }
```

### Server Responses

#### Subscribed acknowledgement
```json
{
  "type": "subscribed",
  "categories": ["memes"]
}
```
If no categories were specified, returns `["all"]`.

#### Unsubscribed acknowledgement
```json
{ "type": "unsubscribed" }
```

#### Markets update (broadcast)
Sent after each scrape cycle (~every 5-10 seconds).
```json
{
  "type": "markets_update",
  "dex": "lighter",
  "categoryCounts": {
    "layer1": 17,
    "layer2": 4,
    "memes": 10,
    "ai": 5,
    "equities": 18,
    "etf/index": 9,
    "FX": 7,
    "KRW": 1,
    "commodities": 9,
    "pre ipo": 12,
    "other": 76
  },
  "data": [ ... ],
  "timestamp": "2026-05-18T12:00:00.000Z"
}
```

When a client has subscribed to specific categories, `data` and `categoryCounts` are filtered to only include matching markets.

---

## Data Fields (per market)

| Field | Type | Description |
|-------|------|-------------|
| `dex` | string | Always `"lighter"` |
| `symbol` | string | Base asset symbol (e.g. `BTC`, `1000PEPE`) |
| `fullSymbol` | string | `"lighter:{symbol}"` |
| `displayName` | string | Same as `symbol` |
| `categories` | string[] | Category tags assigned to this market |
| `markPrice` | number | Last trade price |
| `change24hPct` | number | 24h price change (decimal, e.g. `-0.0372` = -3.72%) |
| `funding8hPct` | number | Current funding rate |
| `volume24hUSD` | number | 24h quote token volume in USD |
| `openInterestQty` | number | Open interest in base asset units |
| `openInterestUSD` | number | Open interest in USD |
| `openInterestDisplayUSD` | number | Open interest in USD (display value) |
| `iconUrl` | string | Token icon URL |
| `updatedAt` | string | ISO timestamp of last update |

---

## Category Reference (dynamic — from backend)

> The categories below are the ones currently present in the database. The full list is always available via `GET /api/dashboard/meta` and updates automatically as new tokens are added to the orderbook.

| Category | Example Symbols |
|----------|----------------|
| `majors` | BTC, ETH, SOL, XRP |
| `layer1` | ADA, AVAX, DOT, NEAR, APT, SUI, TON, HBAR, TRX |
| `layer2` | ARB, OP, STRK, ZK |
| `memes` | DOGE, 1000SHIB, 1000PEPE, WIF, POPCAT, TRUMP |
| `ai` | TAO, VIRTUAL, WLD, GRASS, FET |
| `equities` | NVDA, TSLA, AAPL, MSFT, AMZN, META, PLTR, COIN, MSTR |
| `etf/index` | SPY, QQQ, IWM, SOXX, EWY |
| `FX` | EURUSD, GBPUSD, USDJPY, AUDUSD |
| `KRW` | USDKRW, KRW |
| `commodities` | XAU, XAG, WTI, BRENTOIL, NATGAS, XCU |
| `pre ipo` | SPACEX, STRC, RIVER, CRWV, CHIP |
| `other` | Any symbol not matching above categories |
