const express = require("express");
const server = express();

const REDIRECT_URL = "https://diversitycraft.onrender.com/";

function keepAlive() {
  server.all("/", (req, res) => {
    res.statusCode = 302;

    res.setHeader("Location", REDIRECT_URL);

    res.end();
  });

  server.listen(3000, () => {
    console.log("[Server] KeepAlive server is running");
  });
}

module.exports = keepAlive;
