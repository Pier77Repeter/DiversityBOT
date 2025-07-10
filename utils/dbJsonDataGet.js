const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("DbJsonDataGet");

// this just gets the 'items' or 'fishes' from db
module.exports = async function dbJsonDataGet(client, user, message, dataName) {
  const jsonDataName = dataName.toLowerCase();

  if (jsonDataName != "items" && jsonDataName != "fishes") {
    throw "Invalid data name, must be 'items' or 'fishes'";
  }

  try {
    const row = await new Promise((resolve, reject) => {
      client.database.get(`SELECT ${dataName} FROM User WHERE serverId = ? AND userId = ?`, [message.guild.id, user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) {
      const embed = new EmbedBuilder();

      switch (jsonDataName) {
        case "items":
          embed
            .setColor(0x33ccff)
            .setTitle("💼 " + user.username + "'s inventory:")
            .setDescription("You have nothing, go buy something in the store!");
          break;

        case "fishes":
          embed
            .setColor(0x33ccff)
            .setTitle("🪣 " + user.username + "'s bucket:")
            .setDescription("You have no fishes here! Go fish something!");
          break;
      }

      try {
        await message.reply({ embeds: [embed] });
      } catch (error) {
        // continue
      }

      return null;
    }

    return JSON.parse(row[jsonDataName]); // it's a string
  } catch (error) {
    logger.error("Error getting JSON data '" + dataName + "': Server '" + message.guild.id + "' - User '" + message.author.id + "'", error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Critical error")
      .setDescription("Failed to get your stuff from my database, please **report this error with your server ID AND user ID**")
      .addFields({ name: "Submit report here", value: "https://discord.gg/KxadTdz" });

    try {
      await message.reply({ embeds: [embed] });
    } catch (error) {
      // CONTINUE
    }

    return null;
  }
};
