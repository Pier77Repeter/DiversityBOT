const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../utils/msgErrorHandler");

module.exports = {
  data: new SlashCommandBuilder().setName("news").setDescription("Shows the recent news/changelogs"),

  async execute(client, interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x339999)
      .setTitle("📜 Changelogs/News")
      .setDescription(
        [
          "**Release 2.2!**",
          "",
          "Added RNG drop system",
          "Added the new RNG command category",
          "Added d!info and /info for checking commands",
          "Improved d!sell and d!buy commands",
          "Improved the title of most embeds",
          "Improved the embeds of mod commands",
          "Slightly boosted Bot's performances",
          "Cleaned up backend code",
          "General bug fixes",
        ].join("\n"),
      )
      .addFields({
        name: "More info, suggestions and bug report here:",
        value: "https://discord.gg/KxadTdz",
        inline: false,
      });

    interaction.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
