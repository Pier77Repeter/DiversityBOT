const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "news",
  description: "See the news",
  async execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor(0x339999)
      .setTitle("📜 Changelogs/news")
      .setDescription(["**Release 2.1!**", "The Bot has now a professional dedicated Database!", "idk dude"].join("\n"))
      .addFields({
        name: "More info, suggestions and bug report here:",
        value: "https://discord.gg/KxadTdz",
        inline: false,
      });

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
