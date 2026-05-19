const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("DbJsonDataGet");

// this just gets the 'items' or 'fishes' from db
module.exports = async function dbJsonDataGet(client, user, message, dataName) {
  try {
    const row = await client.database.query(`SELECT ${dataName} FROM users WHERE server_id = $1 AND user_id = $2`, [message.guild.id, user.id]);

    if (row.rowCount === 0) throw new Error("Failed to find in database: Server '" + message.guild.id + "' - User '" + message.author.id + "'");

    return row.rows[0][dataName]; // it's a json object!
  } catch (error) {
    logger.error("Error getting json data '" + dataName + "': Server '" + message.guild.id + "' - User '" + message.author.id + "'", error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Critical error")
      .setDescription("Failed to get your stuff from my database, please **report this error with the server ID and your user ID**")
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
