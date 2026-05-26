const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "level",
  description: "Check the level the user has",
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

    const row = await client.database.query("SELECT level, next_xp FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

    embed.setColor(0x00cccc);

    if (row.rowCount === 0) {
      embed
        .setTitle(user.username + " current level")
        .setDescription("Bro is at level **0** 🤦‍♂️🤦‍♂️🤦‍♂️")
        .setThumbnail(user.displayAvatarURL());

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const level = row.rows[0].level;
    const nextXp = row.rows[0].next_xp;

    embed.setTitle(user.username + " current level").setDescription(["💈 Level: **" + level + "**", "", "⏭️ XP requiered for next level: **" + nextXp + "**"].join("\n"));

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
