const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "scredits",
  description: "Shows the social credits an user has",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT socialCredits FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const embed = new EmbedBuilder();

    if (!row) {
      embed
        .setColor(0x33cc00)
        .setTitle(user.username + "'s social credits")
        .setDescription("Earned social credits: **0**")
        .setThumbnail(user.displayAvatarURL());

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const socialCredits = row.socialCredits;

    embed
      .setColor(0x33cc00)
      .setTitle(user.username + "'s social credits")
      .setDescription("Earned social credits: **" + socialCredits + "**")
      .setThumbnail(user.displayAvatarURL());

    if (socialCredits < 0) {
      embed.setColor(0xff0000).setFooter({ text: "You are not a good Chinese citizen" });
    }

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
