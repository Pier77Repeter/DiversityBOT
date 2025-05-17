const { EmbedBuilder } = require("discord.js");

// thing to update json data in DB, at the moment it's only 'items' and 'fishes'
module.exports = async function dbJsonDataSet(client, message, dataName, jsonData) {
  const logPrefix = "[DbJsonDataSet.js/ERROR]:";

  const jsonDataName = dataName.toLowerCase();

  if (jsonDataName != "items" && jsonDataName != "fishes") {
    throw "invalid data name, must be 'items' or 'fishes'";
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
    console.error(logPrefix, "Something wrong happened while setting JSON data: " + error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("Failed to update your stuff in database, **report this issue with your ID**")
      .addFields({ name: "Submit report here", value: "https://discord.gg/KxadTdz" });

    try {
      await message.reply({ embeds: [embed] });
    } catch (error) {
      // CONTINUE
    }

    return null;
  }
};
