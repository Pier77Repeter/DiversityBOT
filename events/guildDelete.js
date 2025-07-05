const { Events } = require("discord.js");
const logger = require("../logger")("GuildDelete");

module.exports = (client) => {
  client.on(Events.GuildDelete, async (guild) => {
    await new Promise((resolve, reject) => {
      client.database.serialize(() => {
        client.database.run("DELETE FROM Server WHERE serverId = ?", guild.id, (err) => {
          if (err) {
            logger.error("Failed to delete guild: '" + guild.id + "'", err);
            reject(err);
          } else {
            resolve();
          }
        });

        client.database.run("DELETE FROM Channel WHERE serverId = ?", guild.id, (err) => {
          if (err) {
            logger.error("Failed to delete channels guild: '" + guild.id + "'", err);
            reject(err);
          } else {
            resolve();
          }
        });

        client.database.run("DELETE FROM User WHERE serverId = ?", guild.id, (err) => {
          if (err) {
            logger.error("Failed to delete users guild: '" + guild.id + "'", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  });
};
