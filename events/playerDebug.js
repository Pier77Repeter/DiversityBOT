// this event is for debugging purposes ignore the warning message when this file is commented
// ignore this -> "Invalid event file: playerDebug.js, expected 'module.exports' to be a function"
/*
const { GuildQueueEvent, useMainPlayer } = require("discord-player");
const logger = require("../logger")("PlayerDebug");

module.exports = (client) => {
  const player = useMainPlayer();

  player.on(GuildQueueEvent.Debug, async (message) => {
    logger.info(message);
  });
};
*/
