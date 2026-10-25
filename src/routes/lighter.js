"use strict";

const express = require("express");
const { getAll, getByCategory, getBySymbol, getCategoryCounts } = require("../controllers/lighterController");

const router = express.Router();

router.get("/all", getAll);
router.get("/categories", getCategoryCounts);
router.get("/category/:category", getByCategory);
router.get("/symbol/:symbol", getBySymbol);

module.exports = router;
