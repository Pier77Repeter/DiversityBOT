const { Events } = require("discord.js");

module.exports = (client) => {
  const logPrefix = "[GuildDelete]:";
  const logError = "[GuildDelete/ERROR]:";

  client.on(Events.GuildDelete, async (guild) => {
    await new Promise((resolve, reject) => {
      client.database.run("DELETE FROM Server WHERE serverId = ?", guild.id, (err) => {
        if (err) {
          console.error(logError, "Failed to delete guild: " + guild.id + " error: " + err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};
