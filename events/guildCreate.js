const { Events } = require("discord.js");
const logger = require("../logger")("GuildCreate");

module.exports = (client) => {
  client.on(Events.GuildCreate, async (guild) => {
    // immediatly inserting the configs to base value when bot is added
    await new Promise((resolve, reject) => {
      // by default all configs should be enabled
      client.database.run("INSERT INTO Server VALUES (?, 1, 1, 1, 1, 'null', 0, 0, 0, 0, 0, 0)", guild.id, (err) => {
        if (err) {
          logger.error("Error while INSERTING data in db: Server '" + guild.id + "'", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};
