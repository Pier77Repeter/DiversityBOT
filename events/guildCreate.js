const { Events } = require("discord.js");

module.exports = (client) => {
  const logError = "[GuildCreate/ERROR]:";

  client.on(Events.GuildCreate, async (guild) => {
    // immediatly inserting the configs to base value when bot is added
    await new Promise((resolve, reject) => {
      // by default all configs should be enabled
      client.database.run("INSERT INTO Server VALUES (?, 1, 1, 1, 1, 'null', 0, 0, 0, 0, 0, 0)", guild.id, (err) => {
        if (err) {
          console.error(logError, "Something went wrong while INSERTING data into db: " + err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};
