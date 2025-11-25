const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "materials",
  description: "Check the materials the user has collected",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isEventEnabled = await configChecker(client, message, "eventCmd");
    if (isEventEnabled == null) return;

    if (!isEventEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Event commands are off! Type **d!setup event** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT twigs, leaves, goldenCoins, decoId1, decoId2, decoId3, decoId4 FROM Event WHERE serverId = ? AND userId = ?",
        [message.guild.id, user.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!row) {
      embed.setColor(0xff0000).setTitle("😥 Sad").setDescription("It seems like the user dosen't know i exist and won't get the materials for his tree");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    embed
      .setColor(0x33ccff)
      .setTitle("🛠️" + user.username + "'smaterials")
      .setDescription("You have nothing, go in the forest or help Santa to collect some");

    // in case the user has at least 1 item, remove the description that says "you have nothing"
    for (const key in row) {
      if (row[key] != 0) {
        embed.setDescription(
          [
            "🪙 Golden coins: **" + row.goldenCoins + "**",
            "🪵 Twigs: **" + row.twigs + "**",
            "🌿 Leaves: **" + row.leaves + "**",
            "",
            "**Owned decorations list**",
          ].join("\n")
        );
        break;
      }
    }

    if (row.decoId1 == 0 && row.decoId2 == 0 && row.decoId3 == 0 && row.decoId4 == 0) {
      embed.setDescription(
        [
          "🪙 Golden coins: **" + row.goldenCoins + "**",
          "🪵 Twigs: **" + row.twigs + "**",
          "🌿 Leaves: **" + row.leaves + "**",
          "",
          "**Owned decorations list**",
          "You don't own any decorations yet, go buy them in the shop",
        ].join("\n")
      );
    }

    if (row.decoId1) {
      embed.addFields({ name: "🌟 Christmas star", value: "Best decoration out there!" });
    }

    if (row.decoId2) {
      embed.addFields({ name: "🕯️ Candles", value: "Your tree needs some lights" });
    }

    if (row.decoId3) {
      embed.addFields({ name: "🔴 Christmas balls (multi-color)", value: "Classic decorations (Don't get the name wrong)" });
    }

    if (row.decoId4) {
      embed.addFields({ name: "🟥 Tree decorations (multi-color)", value: "Classic decoration to make your tree look better" });
    }

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
