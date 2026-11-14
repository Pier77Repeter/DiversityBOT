const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("MissingDataHandler");
const msgErrorHandler = require("./msgErrorHandler");

// this functions covers the edge case when a returned row is empty even if data exists in db
module.exports = function missingDataHandler(actionSource, userId = null) {
  const embed = new EmbedBuilder().setColor(0xff0000).setTitle("⚠️ Critical Error");

  if (userId) {
    logger.error(`Database query returned no user data from: Server '${actionSource.guildId}' - User '${userId}'`, new Error("Expected one user row but the query returned none"));

    embed
      .setDescription("Failed to get your user database data, please **report this error with the server id and your user id**")
      .addFields(
        { name: "Server ID", value: `\`${actionSource.guildId}\``, inline: true },
        { name: "User ID", value: `\`${userId}\``, inline: true },
        { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" },
      );
  } else {
    logger.error(`Database query returned no server data from: Server '${actionSource.guildId}'`, new Error("Expected one server row but the query returned none"));

    embed
      .setDescription("Failed to get server database data, please **report this error with this server id**")
      .addFields({ name: "Server ID", value: `\`${actionSource.guildId}\``, inline: true }, { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" });
  }

  actionSource.reply({ embeds: [embed] }).catch(msgErrorHandler);
};
