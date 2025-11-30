const { Events } = require("discord.js");
const logger = require("../logger")("GuildCreate");

module.exports = (client) => {
  client.on(Events.GuildCreate, async (guild) => {
    try {
      // immediatly inserting the configs to base value when bot is added
      await new Promise((resolve, reject) => {
        // by default all configs should be enabled
        client.database.run("INSERT INTO Server VALUES (?, 1, 1, 1, 1, 'null', 0, 0, 0, 0, 0, 0)", guild.id, (err) => {
          if (err) {
            reject("Error while INSERTING data in db: Server '" + guild.id + "'\n" + err);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      return logger.error(error);
    }
  });
};
