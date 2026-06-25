const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("ConfigChecker");

// this is very useful since it's gonna save tons of lines and time when checking configs
module.exports = async function configChecker(client, message, configName, logError = true) {
  try {
    const row = await client.database.query(`SELECT ${configName} FROM servers WHERE server_id = $1`, [message.guildId]);

    // row.rows[0].exists IS ONLY FOR SELECT EXISTS(), if server isn't found go to catch block
    if (row.rowCount === 0) throw new Error("Failed to find in database: Server '" + message.guildId + "'");

    return row.rows[0][configName];
  } catch (error) {
    // this is important, we must log it
    logger.error("Error getting config '" + configName + "': Server '" + message.guildId + "'", error);

    if (!logError) return null; // do not log if set to false

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Critical error")
      .setDescription("Failed to get server configs, please **report this error with the server id**")
      .addFields({ name: "Server ID", value: `\`${message.guildId}\``, inline: true }, { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" });

    try {
      await message.reply({ embeds: [embed] });
    } catch {
      // continue to return null
    }

    return null;
  }
};
