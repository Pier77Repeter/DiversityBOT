const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../utils/msgErrorHandler");

module.exports = {
  data: new SlashCommandBuilder().setName("news").setDescription("Shows the recent news/changelogs"),

  async execute(client, interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x339999)
      .setTitle("📜 Changelogs/News")
      .setDescription(["**Release 2.2!**", "", "Blah blah blah, will write later when i'm done"].join("\n"))
      .addFields({
        name: "More info, suggestions and bug report here:",
        value: "https://discord.gg/KxadTdz",
        inline: false,
      });

    return await interaction.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
