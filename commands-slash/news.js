const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("news").setDescription("Shows the recent news/changelogs"),

  async execute(client, interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x339999)
      .setTitle("📜 Changelogs/news")
      .setDescription(["**Release 2.1!**", "", "The Bot has now a professional dedicated Database!"].join("\n"))
      .addFields({
        name: "More info, suggestions and bug report here:",
        value: "https://discord.gg/KxadTdz",
        inline: false,
      });

    try {
      return await interaction.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
