"use strict";

const { getCollection } = require("../db/mongo");

async function getAll(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 200;
    const skip = parseInt(req.query.skip) || 0;
    const filter = {};

    const category = req.query.category;
    if (category) {
      const cats = category.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
      filter.categories = cats.length === 1 ? cats[0] : { $in: cats };
    }

    const col = getCollection();
    const markets = await col
      .find(filter)
      .sort({ volume24hUSD: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({ success: true, data: markets });
  } catch (err) {
    next(err);
  }
}

async function getByCategory(req, res, next) {
  try {
    const cats = req.params.category.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
    if (cats.length === 0) {
      return res.status(400).json({ success: false, error: "Invalid category" });
    }

    const filter = { categories: cats.length === 1 ? cats[0] : { $in: cats } };
    const limit = parseInt(req.query.limit) || 200;
    const skip = parseInt(req.query.skip) || 0;

    const col = getCollection();
    const markets = await col
      .find(filter)
      .sort({ volume24hUSD: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({ success: true, data: markets });
  } catch (err) {
    next(err);
  }
}

async function getBySymbol(req, res, next) {
  try {
    const col = getCollection();
    const market = await col.findOne({ symbol: req.params.symbol.toUpperCase() });

    if (!market) {
      return res.status(404).json({ success: false, error: "Symbol not found" });
    }

    res.json({ success: true, data: market });
  } catch (err) {
    next(err);
  }
}

async function getCategoryCounts(req, res, next) {
  try {
    const col = getCollection();
    const counts = await col.aggregate([
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray();

    const result = {};
    for (const c of counts) {
      result[c._id] = c.count;
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getByCategory, getBySymbol, getCategoryCounts };
