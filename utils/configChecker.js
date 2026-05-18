const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("ConfigChecker");

// this is very useful since it's gonna save tons of lines and time when checking configs
module.exports = async function configChecker(client, message, configName, logError = true) {
  try {
    const row = await client.database.query(`SELECT ${configName} FROM servers WHERE server_id = $1`, [message.guild.id]);

    // row.rows[0].exists IS ONLY FOR SELECT EXISTS()
    if (row.rowCount === 0) throw new Error("Server '" + message.guild.id + "' was not found in database");

    const configValue = row.rows[0][configName];

    return configValue;
  } catch (error) {
    // this is important, we must log it
    logger.error("Error getting config '" + configName + "': Server '" + message.guild.id + "'", error);

    if (!logError) return null; // do not log since it's set to false

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Critical error")
      .setDescription("Failed to get server configs, please **report this error with the server ID**")
      .addFields({ name: "Server ID", value: `\`${message.guild.id}\``, inline: true }, { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" });

    try {
      await message.reply({ embeds: [embed] });
    } catch {
      // continue to return null
    }

    return null;
  }
};
