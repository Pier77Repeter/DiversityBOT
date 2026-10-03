const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("./msgErrorHandler");
const logger = require("../logger")("DbJsonDataGet");

// this gets any json data from database, since json data can be only be present in either users or servers
// we can just put the user parameter has optional so by default it gets the server json data
module.exports = async function dbJsonDataGet(client, message, dataName, userId = null, logError = true) {
  const embed = new EmbedBuilder();

  // working on users table
  if (userId) {
    try {
      const row = await client.database.query(`SELECT ${dataName} FROM users WHERE server_id = $1 AND user_id = $2`, [message.guildId, userId]);

      if (row.rowCount === 0) throw new Error(`Failed to find user in database: Server '${message.guildId}' - User '${userId}'`);

      return row.rows[0][dataName]; // it's a json object!
    } catch (error) {
      logger.error(`Error getting json data '${dataName}': Server '${message.guildId}' - User '${userId}'`, error);

      embed
        .setColor(0xff0000)
        .setTitle("⚠️ Critical error")
        .setDescription("Failed to get your stuff from my database, please **report this error with the server ID and your user ID**")
        .addFields(
          { name: "Server ID", value: `\`${message.guildId}\``, inline: true },
          { name: "User ID", value: `\`${userId}\``, inline: true },
          { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" },
        );
    }

    // working on servers table
  } else {
    try {
      const row = await client.database.query(`SELECT ${dataName} FROM servers WHERE server_id = $1`, [message.guildId]);

      if (row.rowCount === 0) throw new Error(`Failed to find server in database: Server '${message.guildId}'`);

      return row.rows[0][dataName]; // it's a json object! x2
    } catch (error) {
      logger.error(`Error getting json data '${dataName}': Server '${message.guildId}'`, error);

      embed
        .setColor(0xff0000)
        .setTitle("⚠️ Critical error")
        .setDescription("Failed to get server stuff from my database, please **report this error with the server ID**")
        .addFields({ name: "Server ID", value: `\`${message.guildId}\``, inline: true }, { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" });
    }
  }

  // we got an error and not the json we wanted :(
  if (logError) await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  return null;
};
