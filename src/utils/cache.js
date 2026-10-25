"use strict";

function createCache(ttlMs) {
  const store = new Map();

  return {
    get(key) {
      const entry = store.get(key);
      if (!entry) return null;
      if (Date.now() - entry.timestamp > ttlMs) {
        store.delete(key);
        return null;
      }
      return entry.data;
    },
    set(key, data) {
      store.set(key, { data, timestamp: Date.now() });
    },
  };
}

function createCachedHandler(name, computeFn, options = {}) {
  const { ttlMs = 3 * 60 * 1000 } = options;
  const cache = createCache(ttlMs);

  return async (req, res, next) => {
    try {
      const key = `${name}:${req.query.dex || "lighter"}`;

      const cached = cache.get(key);
      if (cached) {
        return res.json({ ...cached, cached: true });
      }

      const result = await computeFn(req);
      cache.set(key, result);
      return res.json({ ...result, cached: false });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { createCache, createCachedHandler };
