const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "credits",
  description: "Special people who made me",
  async execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor(0xffff00)
      .setTitle("🤩 Special credits")
      .setDescription("Thanks to all the following people for making me possible!")
      .addFields(
        {
          name: "**Pier77Repeter**",
          value: "For coding and maintaining me!",
          inline: false,
        },
        {
          name: "**achernar67**",
          value: "For testing new features",
          inline: false,
        },
        {
          name: "**You**",
          value: "For supporting me! ❤️",
          inline: false,
        }
      );

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
