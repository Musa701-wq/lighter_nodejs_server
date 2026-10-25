"use strict";

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const lighterRoutes = require("./routes/lighter");
const perpRoutes = require("./routes/perp");
const { checkCache, getVolume, getOpenInterest, getFundingRates, getTopMovers, getPerpsMeta } = require("./controllers/dashboardController");

const app = express();

const trustProxy = parseInt(process.env.TRUST_PROXY, 10) || 0;
if (trustProxy > 0) {
  app.set("trust proxy", trustProxy);
}

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests, please try again later." },
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Dashboard routes with cache check BEFORE rate limiter
app.get("/api/dashboard/volume", checkCache("getVolume"), apiLimiter, getVolume);
app.get("/api/dashboard/open-interest", checkCache("getOpenInterest"), apiLimiter, getOpenInterest);
app.get("/api/dashboard/funding-rates", checkCache("getFundingRates"), apiLimiter, getFundingRates);
app.get("/api/dashboard/top-movers", checkCache("getTopMovers"), apiLimiter, getTopMovers);
app.get("/api/dashboard/meta", checkCache("getPerpsMeta"), apiLimiter, getPerpsMeta);

// Perp analytics routes
app.use("/api/perps", apiLimiter, perpRoutes);

// Other API routes with rate limiter
app.use("/api", apiLimiter, lighterRoutes);

app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ success: false, error: err.message });
});

module.exports = app;
