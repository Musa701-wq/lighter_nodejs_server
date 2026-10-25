"use strict";

const http = require("http");
const app = require("./app");
const config = require("./config");
const { connectMongo } = require("./db/mongo");
const { initWS } = require("./services/lighterWs");
const logger = require("./utils/logger");

const MONGO_CONNECT_RETRIES = parseInt(process.env.MONGO_CONNECT_RETRIES, 10) || 0;
const MONGO_CONNECT_RETRY_DELAY_MS = parseInt(process.env.MONGO_CONNECT_RETRY_DELAY_MS, 10) || 5000;

async function connectMongoWithRetry() {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await connectMongo();
      return;
    } catch (err) {
      attempt++;
      const retriesLeft = MONGO_CONNECT_RETRIES === 0 ? Infinity : MONGO_CONNECT_RETRIES - attempt;
      if (retriesLeft < 0) throw err;
      logger.error(`Mongo connection failed (attempt ${attempt}): ${err.message}`);
      logger.warn(
        `Retrying Mongo connection in ${MONGO_CONNECT_RETRY_DELAY_MS}ms...` +
          (retriesLeft !== Infinity ? ` (${retriesLeft} retries left)` : "")
      );
      await new Promise((resolve) => setTimeout(resolve, MONGO_CONNECT_RETRY_DELAY_MS));
    }
  }
}

//main
async function main() {
  await connectMongoWithRetry();

  const server = http.createServer(app);

  server.listen(config.server.port, () => {
    logger.info(`Lighter server running on port ${config.server.port}`);
  });

  initWS(server);
  logger.info("Lighter WebSocket initialized, waiting for connections...");
}

main();
