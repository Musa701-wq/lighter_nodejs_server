"use strict";

const WebSocket = require("ws");
const logger = require("../utils/logger");
const { incrementConnections, decrementConnections, setBroadcastFunction } = require("./lighterScraper");

const VALID_CATEGORIES = new Set([
  "majors", "layer1", "layer2", "memes", "ai", "equities",
  "etf/index", "FX", "KRW", "commodities", "pre ipo", "other",
  "defi", "new", "upcoming", "compute", "rwa",
]);

const WS_ALLOWED_ORIGINS = (process.env.WS_ALLOWED_ORIGINS || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const MAX_WS_CONNECTIONS_PER_IP = parseInt(process.env.WS_MAX_CONNECTIONS_PER_IP, 10) || 5;
const WS_MESSAGE_WINDOW_MS = parseInt(process.env.WS_MESSAGE_WINDOW_MS, 10) || 10_000;
const WS_MAX_MESSAGES_PER_WINDOW = parseInt(process.env.WS_MAX_MESSAGES_PER_WINDOW, 10) || 50;

let clients = new Set();
const connectionCounts = new Map();

function normalizeCategories(categoryParam) {
  if (!categoryParam) return [];

  const categories = (Array.isArray(categoryParam) ? categoryParam : [categoryParam])
    .flatMap((value) => String(value).split(","))
    .map((cat) => cat.trim().toLowerCase())
    .filter(Boolean);

  return categories.filter((c) => VALID_CATEGORIES.has(c));
}

function computeCategoryCounts(rows) {
  const counts = {};

  for (const row of rows) {
    if (!Array.isArray(row.categories)) continue;
    for (const cat of row.categories) {
      const key = cat.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    }
  }

  return counts;
}

function filterPayloadForClient(ws, data) {
  if (data.type !== "markets_update" || !Array.isArray(data.data)) {
    return data;
  }

  if (!ws.categories || ws.categories.length === 0) {
    return data;
  }

  const filteredRows = data.data.filter((row) => {
    if (!Array.isArray(row.categories)) return false;
    return row.categories.some((cat) => ws.categories.includes(cat.toLowerCase()));
  });

  return {
    ...data,
    categoryCounts: computeCategoryCounts(filteredRows),
    data: filteredRows,
  };
}

function getClientIp(req) {
  return (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
}

function isOriginAllowed(origin) {
  if (!origin || WS_ALLOWED_ORIGINS.includes("*")) return true;
  return WS_ALLOWED_ORIGINS.includes(origin);
}

function canAcceptConnection(ip) {
  const current = connectionCounts.get(ip) || 0;
  if (current >= MAX_WS_CONNECTIONS_PER_IP) return false;
  connectionCounts.set(ip, current + 1);
  return true;
}

function decrementConnectionCount(ip) {
  const current = connectionCounts.get(ip) || 0;
  if (current <= 1) {
    connectionCounts.delete(ip);
  } else {
    connectionCounts.set(ip, current - 1);
  }
}

function trackWsMessage(ws) {
  const now = Date.now();
  ws._messageTimestamps = (ws._messageTimestamps || []).filter(
    (timestamp) => now - timestamp < WS_MESSAGE_WINDOW_MS,
  );

  if (ws._messageTimestamps.length >= WS_MAX_MESSAGES_PER_WINDOW) {
    return false;
  }

  ws._messageTimestamps.push(now);
  return true;
}

function handleClientMessage(ws, rawMessage) {
  if (!trackWsMessage(ws)) {
    logger.warn(`WS rate limit exceeded for ${ws._clientIp}`);
    ws.close(1008, "Rate limit exceeded");
    return;
  }

  let message;

  try {
    message = JSON.parse(rawMessage);
  } catch (err) {
    logger.warn("Received invalid WS message, ignoring");
    return;
  }

  if (message.type === "subscribe") {
    const categories = normalizeCategories(message.categories || message.category);
    ws.categories = categories;
    ws.send(JSON.stringify({
      type: "subscribed",
      categories: categories.length > 0 ? categories : ["all"],
    }));
    return;
  }

  if (message.type === "unsubscribe") {
    ws.categories = [];
    ws.send(JSON.stringify({ type: "unsubscribed" }));
    return;
  }

  logger.warn(`Unknown WS message type: ${message.type}`);
}

function broadcast(data) {
  clients.forEach((ws) => {
    if (ws.readyState !== WebSocket.OPEN) return;
    const payload = filterPayloadForClient(ws, data);
    ws.send(JSON.stringify(payload));
  });
}

function initWS(server) {
  setBroadcastFunction(broadcast);

  const wss = new WebSocket.Server({
    server,
    verifyClient: (info, done) => {
      if (!isOriginAllowed(info.req.headers.origin)) {
        logger.warn(`Rejected WS origin: ${info.req.headers.origin}`);
        return done(false, 403, "Forbidden");
      }
      done(true);
    },
  });

  wss.on("connection", (ws, req) => {
    const ip = getClientIp(req);
    if (!canAcceptConnection(ip)) {
      logger.warn(`Rejected WS connection from ${ip}: too many connections`);
      ws.close(1008, "Too many connections");
      return;
    }

    logger.info("Lighter WS client connected");
    ws.categories = [];
    ws._clientIp = ip;
    clients.add(ws);

    incrementConnections();

    ws.on("message", (message) => handleClientMessage(ws, message));

    ws.on("close", () => {
      clients.delete(ws);
      decrementConnectionCount(ip);
      logger.info("Lighter WS client disconnected");
      decrementConnections();
    });
  });
}

module.exports = { initWS, broadcast };
