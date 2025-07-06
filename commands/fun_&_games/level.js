const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "level",
  description: "Check the level the user has",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT level, nextXp FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const embed = new EmbedBuilder().setColor(0x00cccc);

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
