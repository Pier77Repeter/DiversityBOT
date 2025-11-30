const { Events } = require("discord.js");
const logger = require("../logger")("GuildDelete");

module.exports = (client) => {
  client.on(Events.GuildDelete, async (guild) => {
    try {
      await new Promise((resolve, reject) => {
        client.database.serialize(() => {
          client.database.run("DELETE FROM Server WHERE serverId = ?", guild.id, (err) => {
            if (err) {
              reject("Failed to DELETE guild: '" + guild.id + "'\n" + err);
            } else {
              resolve();
            }
          });

          client.database.run("DELETE FROM Channel WHERE serverId = ?", guild.id, (err) => {
            if (err) {
              reject("Failed to DELETE guild channels: '" + guild.id + "'\n" + err);
            } else {
              resolve();
            }
          });

          client.database.run("DELETE FROM User WHERE serverId = ?", guild.id, (err) => {
            if (err) {
              reject("Failed to DELETE guild users: '" + guild.id + "'\n" + err);
            } else {
              resolve();
            }
          });
        });
      });
    } catch (error) {
      return logger.error(error);
    }
  });
};
