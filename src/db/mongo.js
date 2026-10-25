"use strict";
const { MongoClient } = require("mongodb");
const config = require("../config");
const logger = require("../utils/logger");

let col;

async function connectMongo() {
  const client = new MongoClient(config.mongo.uri, {
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  const db = client.db(config.mongo.db);
  col = db.collection(config.mongo.collection);

  await col.createIndex({ dex: 1, symbol: 1 }, { unique: true });
  await col.createIndex({ updatedAt: -1 });

  logger.info("Lighter MongoDB connected");
  return col;
}

function getCollection() {
  if (!col) throw new Error("Mongo not initialized");
  return col;
}

module.exports = { connectMongo, getCollection };
