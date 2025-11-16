const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "level",
  description: "Check the level the user has",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isLevelingEnabled = await configChecker(client, message, "levelingCmd");
    if (isLevelingEnabled == null) return;

    if (isLevelingEnabled == 0) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Leveling commands are off! Type **d!setup leveling** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT level, nextXp FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    embed.setColor(0x00cccc);

    if (!row) {
      embed
        .setTitle(user.username + " current level")
        .setDescription("Bro is at level **0** 🤦‍♂️🤦‍♂️🤦‍♂️")
        .setThumbnail(user.displayAvatarURL());

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const level = row.level;
    const nextXp = row.nextXp;

    embed
      .setTitle(user.username + " current level")
      .setDescription(["💈 Level: **" + level + "**", "", "⏭️ XP requiered for next level: **" + nextXp + "**"].join("\n"));

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
