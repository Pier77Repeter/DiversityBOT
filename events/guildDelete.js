const { Events } = require("discord.js");

module.exports = (client) => {
  const logPrefix = "[GuildDelete]: ";

  client.on(Events.GuildDelete, async (guild) => {
    await new Promise((resolve, reject) => {
      client.database.run("DELETE FROM Server WHERE serverId = ?", guild.id, (err) => {
        if (err) {
          console.error(logPrefix + "Error: " + err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};
