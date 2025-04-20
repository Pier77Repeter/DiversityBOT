const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("event").setDescription("Display the ongoing Bot event"),

  async execute(client, interaction) {
    const eventMessageEmbed = new EmbedBuilder()
      .setColor(0x339999)
      .setTitle("Ongoing event: None")
      .setDescription(["There are no ongoing events, check the Discord for more: https://discord.gg/KxadTdz"].join("\n"))
      .setFooter({
        text: "Sadly, no events at the moment",
      });

    try {
      return await interaction.reply({ embeds: [eventMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
