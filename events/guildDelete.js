const { Events } = require("discord.js");
const logger = require("../logger")("GuildDelete");

module.exports = (client) => {
  client.on(Events.GuildDelete, async (guild) => {
    // postgres deletes the rest due to "ON DELETE CASCADE"
    await client.database.query("DELETE FROM servers WHERE server_id = $1", [guild.id]).catch((error) => {
      logger.error("Failed to DELETE guild data: '" + guild.id + "'", error);
    });
  });
};
