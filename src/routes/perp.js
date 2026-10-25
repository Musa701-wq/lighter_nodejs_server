"use strict";

const express = require("express");
const {
  getSectorPerformance,
  getSqueezeScore,
  getFundingRates,
} = require("../controllers/perpController");

const router = express.Router();

router.get("/sector-performance", getSectorPerformance);
router.get("/squeeze-score", getSqueezeScore);
router.get("/funding-rates", getFundingRates);

module.exports = router;