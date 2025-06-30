const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "link",
  description: "Bot invite link",
  async execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor(0x339999)
      .setTitle("🔗 Here is the invite link: ")
      .setDescription("") // NEEDS UPDATE
      .setFooter({ text: "Make sure the give me all the needed permissions" });

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
