const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "xp",
  description: "Check how much XP the user has",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isLevelingEnabled = await configChecker(client, message, "leveling_cmd");
    if (isLevelingEnabled === null) return;

    if (!isLevelingEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Leveling commands are off! Type **d!setup leveling** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await client.database.query("SELECT xp, next_xp FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

    if (row.rowCount === 0) {
      embed
        .setColor(0x00cccc)
        .setTitle(user.username + " current XP")
        .setDescription("Bro has literally **0 XP** 🤦‍♂️")
        .setThumbnail(user.displayAvatarURL());

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const xp = row.rows[0].xp;
    const nextXp = row.rows[0].next_xp;

    embed.setDescription(["🪩 XP: **" + xp + "**", "", "⏭️ XP for the next level: **" + (nextXp - xp) + "**"].join("\n"));

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
