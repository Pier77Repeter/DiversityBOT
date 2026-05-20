const logger = require("../logger")("ModActionLogger");
const { Message, BaseInteraction } = require("discord.js");

// the mod logger is used in both / and msg commands, it's gonna save lines of code too like all /utils files
module.exports = async function modActionLogger(client, actionSource, embed) {
  try {
    // 'actionSource.guild.id' is equal to 'actionSource.guildId', personally prefer 'guildId' more
    const row = await client.database.query("SELECT mod_log_channel FROM servers WHERE server_id = $1", [actionSource.guildId]);

    // this handles channel not found in db (critical error)
    if (row.rowCount === 0) {
      throw new Error("Failed to find mod log channel: Server '" + actionSource.guildId + "' - Channel '" + actionSource.channelId + "'");
    }

    // if mod log channel is null just do nothin
    if (row.rows[0].mod_log_channel === "null") return;

    // we are 100% sure channel is in database, let's try and find it
    const channel = actionSource.guild.channels.cache.get(row.rows[0].mod_log_channel);

    // maybe it got deleted
    if (!channel) return;

    try {
      return await channel.send({ embeds: [embed] });
    } catch {
      return; // imagine set the mod log channel and bot cant log stuff
    }
  } catch (error) {
    logger.error("Failed to log a mod action", error);
  }
};
