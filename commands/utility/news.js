const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "news",
  description: "See the news",
  async execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor(0x339999)
      .setTitle("📜 Changelogs/News")
      .setDescription(["**Release 2.2!**", "", "Blah blah blah, will write later when i'm done"].join("\n"))
      .addFields({
        name: "More info, suggestions and bug report here:",
        value: "https://discord.gg/KxadTdz",
        inline: false,
      });

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
