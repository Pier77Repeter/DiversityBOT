const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "scredits",
  description: "Shows the social credits an user has",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await client.database.query("SELECT social_credits FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

    const embed = new EmbedBuilder();

    if (row.rowCount === 0) {
      embed
        .setColor(0x33cc00)
        .setTitle(user.username + "'s social credits")
        .setDescription("Earned social credits: **0**")
        .setThumbnail(user.displayAvatarURL());

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const socialCredits = row.rows[0].social_credits;

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
    } catch {
      return;
    }
  },
};
