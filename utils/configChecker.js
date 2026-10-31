const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("ConfigChecker");
const msgErrorHandler = require("./msgErrorHandler");

// this is very useful since it's gonna save tons of lines and time when checking configs
module.exports = async function configChecker(client, message, configName, logError = true) {
  try {
    const res = await client.database.query(`SELECT ${configName} FROM servers WHERE server_id = $1`, [message.guildId]);
    const row = res.rows[0];

    // If the server isn't found, the query returns no row.
    if (!row) throw new Error(`Failed to find guild in database: Server '${message.guildId}'`);

    return row[configName];
  } catch (error) {
    // this is important, we must log it
    logger.error(`Error getting config '${configName}': Server '${message.guildId}'`, error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Critical Error")
      .setDescription("Failed to get server configs, please **report this error with the server id**")
      .addFields({ name: "Server ID", value: `\`${message.guildId}\``, inline: true }, { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" });

    // sometimes we do not need to let the user know (for example in messageCreate.js)
    if (logError) message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    return null;
  }
};
