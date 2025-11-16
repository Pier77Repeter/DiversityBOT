const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "xp",
  description: "Check how much XP the user has",
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
      client.database.get("SELECT xp, nextXp FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) {
      embed
        .setColor(0x00cccc)
        .setTitle(user.username + " current XP")
        .setDescription("Bro has literally **0 XP** 🤦‍♂️")
        .setThumbnail(user.displayAvatarURL());

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const xp = row.xp;
    const nextXp = row.nextXp;

    embed.setDescription(["🪩 XP: **" + xp + "**", "", "⏭️ XP for the next level: **" + (nextXp - xp) + "**"].join("\n"));

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
