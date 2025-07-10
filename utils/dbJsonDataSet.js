const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("DbJsonDataSet");

// thing to update json data in DB, at the moment it's only 'items' and 'fishes'
module.exports = async function dbJsonDataSet(client, message, dataName, jsonData) {
  const jsonDataName = dataName.toLowerCase();

  if (jsonDataName != "items" && jsonDataName != "fishes") {
    throw "Invalid data name, must be 'items' or 'fishes'";
  }

  try {
    const stringfiedData = JSON.stringify(jsonData);
    await new Promise((resolve, reject) => {
      client.database.run(
        `UPDATE User SET ${jsonDataName} = ? WHERE serverId = ? AND userId = ?`,
        [stringfiedData, message.guild.id, message.author.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    return 0;
  } catch (error) {
    logger.error("Error setting JSON data '" + dataName + "': Server '" + message.guild.id + "' - User '" + message.author.id + "'", error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Critical error")
      .setDescription("Failed to update your stuff in database, **report this error with your server ID AND user ID**")
      .addFields({ name: "Submit report here", value: "https://discord.gg/KxadTdz" });

    try {
      await message.reply({ embeds: [embed] });
    } catch (error) {
      // CONTINUE
    }

    return null;
  }
};
