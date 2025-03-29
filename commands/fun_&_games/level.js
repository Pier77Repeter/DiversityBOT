const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "level",
  description: "Check the level the user has",
  async execute(client, message, args) {
    var member;
    if (message.mentions.members.first() == null) {
      member = message.author;
    } else {
      member = message.mentions.members.first().user;
    }

    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT level, nextXp FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, member.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    const levelMessageEmbed = new EmbedBuilder()
      .setColor(0x00cccc)
      .setTitle(member.username + " current level")
      .setDescription("Bro is at level **0** 🤦‍♂️🤦‍♂️🤦‍♂️")
      .setThumbnail(member.displayAvatarURL());

    if (!row) {
      try {
        return await message.reply({ embeds: [levelMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    const level = row.level;
    const nextXp = row.nextXp;

    levelMessageEmbed.setDescription(
      ["💈 Level: **" + level + "**", "\n", "\n", "⏭️ XP requiered for next level: **" + nextXp + "**"].join("")
    );

    try {
      return await message.reply({ embeds: [levelMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
