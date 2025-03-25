const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "scredits",
  description: "Shows the social credits an user has",
  async execute(client, message, args) {
    var member;
    if (message.mentions.members.first() == null) {
      member = message.author;
    } else {
      member = message.mentions.members.first().user;
    }

    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT socialCredits FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, member.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    const screditsMessageEmbed = new EmbedBuilder()
      .setColor(0x33cc00)
      .setTitle(member.username + "'s social credits")
      .setDescription("Earned social credits: **0**")
      .setThumbnail(member.displayAvatarURL());

    if (!row) {
      try {
        return await message.reply({ embeds: [screditsMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    const socialCredits = row.socialCredits;

    screditsMessageEmbed.setDescription("Earned social credits: **" + socialCredits + "**");

    if (socialCredits < 0) {
      screditsMessageEmbed.setColor(0xff0000).setFooter({ text: "You are not a good Chinese citizen" });
    }

    try {
      return await message.reply({ embeds: [screditsMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
