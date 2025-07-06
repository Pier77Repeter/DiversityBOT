const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "news",
  description: "Display the current news",
  async execute(client, message, args) {
    const embed = new EmbedBuilder().setColor(0x339999).setTitle("📜 Changelogs/news").setDescription(["Release 2.0!"].join("\n")).addFields({
      name: "More info, suggestions and bug report here:",
      value: "https://discord.gg/KxadTdz",
      inline: false,
    });

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
