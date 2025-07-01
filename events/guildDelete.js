const { Events } = require("discord.js");

module.exports = (client) => {
  const logError = "[GuildDelete/ERROR]:";

  client.on(Events.GuildDelete, async (guild) => {
    await new Promise((resolve, reject) => {
      client.database.serialize(() => {
        client.database.run("DELETE FROM Server WHERE serverId = ?", guild.id, (err) => {
          if (err) {
            console.error(logError, "Failed to delete guild: " + guild.id + " error: " + err);
            reject(err);
          } else {
            resolve();
          }
        });

        client.database.run("DELETE FROM Channel WHERE serverId = ?", guild.id, (err) => {
          if (err) {
            console.error(logError, "Failed to delete channels guild: " + guild.id + " error: " + err);
            reject(err);
          } else {
            resolve();
          }
        });

        client.database.run("DELETE FROM User WHERE serverId = ?", guild.id, (err) => {
          if (err) {
            console.error(logError, "Failed to delete users guild: " + guild.id + " error: " + err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  });
};
