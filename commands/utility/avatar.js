const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Get user's avatar",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    if (!user) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Please mention a valid user");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const userId = user.id;
    const avatarHash = user.avatar;
    const isAnimated = avatarHash?.startsWith("a_");
    const ext = isAnimated ? "gif" : "png";
    const size = 1024;
    const downloadUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${ext}?size=${size}`;

    const avatarUrl = user.displayAvatarURL({ size: 1024, dynamic: true });
    embed
      .setTitle(`${user.username}'s avatar`)
      .setDescription("**[Download](" + downloadUrl + ")**")
      .setImage(avatarUrl);

    return await message.reply({ embeds: [embed] });
  },
};
