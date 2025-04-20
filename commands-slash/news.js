const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("news").setDescription("Shows the recent news/changelogs"),

  async execute(client, interaction) {
    const newsMessageEmbed = new EmbedBuilder()
      .setColor(0x339999)
      .setTitle("📜 Changelogs/news")
      .setDescription(["Release 2.0!"].join("\n"))
      .addFields({
        name: "More info, suggestions and bug report here:",
        value: "https://discord.gg/KxadTdz",
        inline: false,
      });

    try {
      return await interaction.reply({ embeds: [newsMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
