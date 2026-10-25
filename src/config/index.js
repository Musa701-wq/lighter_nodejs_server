"use strict";
require("dotenv").config();
module.exports = {
  lighter: {
    baseUrl: "https://mainnet.zklighter.elliot.ai",
    wsUrl: "wss://mainnet.zklighter.elliot.ai/stream",
  },
  mongo: {
    uri: process.env.MONGO_URI,
    db: process.env.MONGO_DB || "bubblenexus",
    collection: "lighter",
  },
  server: {
    port: process.env.PORT || 4133,
  },
  scraper: {
    minInterval: 5000,
    maxInterval: 10000,
  },
};
