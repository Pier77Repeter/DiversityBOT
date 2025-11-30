const logger = require("./logger")("Server");
const express = require("express");
const server = express();

const REDIRECT_URL = "https://www.diversitycraft.org/";

function keepAlive() {
  server.all("/", (req, res) => {
    res.statusCode = 302;

    res.setHeader("Location", REDIRECT_URL);

    res.end();
  });

  server.listen(3000, () => {
    logger.info("KeepAlive server is running");
  });
}

module.exports = keepAlive;
