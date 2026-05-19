const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("DbJsonDataSet");

// thing to update json data in DB, at the moment it's only 'items' and 'fishes'
module.exports = async function dbJsonDataSet(client, message, dataName, jsonData) {
  try {
    JSON.parse(jsonData);

    await client.database.query(`UPDATE users SET ${dataName} = $1 WHERE server_id = $2 AND user_id = $3`, [jsonData, message.guild.id, message.author.id]);

    return 0; // everything went gut
  } catch (error) {
    logger.error("Error setting JSON data '" + dataName + "': Server '" + message.guild.id + "' - User '" + message.author.id + "'", error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Critical error")
      .setDescription("Failed to update your stuff in my database, please **report this error with the server ID and your user ID**")
      .addFields(
        { name: "Server ID", value: `\`${message.guild.id}\``, inline: true },
        { name: "User ID", value: `\`${message.author.id}\``, inline: true },
        { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" },
      );

    try {
      await message.reply({ embeds: [embed] });
    } catch {
      // CONTINUE
    }

    return null;
  }
};
