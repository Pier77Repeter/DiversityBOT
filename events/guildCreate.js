const { Events } = require("discord.js");

module.exports = (client) => {
  const logPrefix = "[GuildCreate]: ";

  client.on(Events.GuildCreate, async (guild) => {
    // immediatly inserting the configs to base value when bot is added
    await new Promise((resolve, reject) => {
      // by default all configs should be enabled
      client.database.run("INSERT INTO Server VALUES (?, 1, 1, 1, 1)", guild.id, (err) => {
        if (err) {
          console.log(logPrefix + "Error: " + err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};
