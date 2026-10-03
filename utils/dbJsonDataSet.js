const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("./msgErrorHandler");
const logger = require("../logger")("DbJsonDataSet");

// thing to update json data in DB, same logic as dbJsonDataSet, supports both servers and users tables
module.exports = async function dbJsonDataSet(client, message, dataName, jsonData, userId = null, logError = true) {
  const embed = new EmbedBuilder();

  // working on users table
  if (userId) {
    try {
      await client.database.query(`UPDATE users SET ${dataName} = $1 WHERE server_id = $2 AND user_id = $3`, [JSON.stringify(jsonData), message.guildId, userId]);

      return 0; // everything went gut
    } catch (error) {
      logger.error(`Error setting user json data '${dataName}': Server '${message.guildId}' - User '${userId}'`, error);

      embed
        .setColor(0xff0000)
        .setTitle("⚠️ Critical error")
        .setDescription("Failed to update your stuff in my database, please **report this error with the server ID and your user ID**")
        .addFields(
          { name: "Server ID", value: `\`${message.guildId}\``, inline: true },
          { name: "User ID", value: `\`${userId}\``, inline: true },
          { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" },
        );
    }

    // working on servers table
  } else {
    try {
      await client.database.query(`UPDATE servers SET ${dataName} = $1 WHERE server_id = $2`, [JSON.stringify(jsonData), message.guildId]);

      return 0; // everything went gut
    } catch (error) {
      logger.error(`Error setting server json data '${dataName}': Server '${message.guildId}'`, error);

      embed
        .setColor(0xff0000)
        .setTitle("⚠️ Critical error")
        .setDescription("Failed to update server's stuff in my database, please **report this error with the server ID**")
        .addFields({ name: "Server ID", value: `\`${message.guildId}\``, inline: true }, { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" });
    }
  }

  // we did not set the data correctly :(
  if (logError) await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  return null;
};
