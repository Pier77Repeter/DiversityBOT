const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "xp",
  description: "Check how much XP the user has",
  async execute(client, message, args) {
    var member;
    if (message.mentions.members.first() == null) {
      member = message.author;
    } else {
      member = message.mentions.members.first().user;
    }

    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT xp, nextXp FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, member.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    const xpMessageEmbed = new EmbedBuilder()
      .setColor(0x00cccc)
      .setTitle(member.username + " current XP")
      .setDescription("Bro has literally **0 XP** 🤦‍♂️")
      .setThumbnail(member.displayAvatarURL());

    if (!row) {
      try {
        return await message.reply({ embeds: [xpMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    const xp = row.xp;
    const nextXp = row.nextXp;

    xpMessageEmbed.setDescription(
      ["🪩 XP: **" + xp + "**", "", "⏭️ XP for the next level: **" + (nextXp - xp) + "**"].join("\n")
    );

    try {
      return await message.reply({ embeds: [xpMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
