const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("link").setDescription("Displays all links for the Bot"),

  async execute(client, interaction) {
    const embed = new EmbedBuilder()
      .setColor(0xcc0000)
      .setTitle("🤖 Bot links")
      .addFields({
        name: "Invite link",
        value: "https://discord.com/oauth2/authorize?client_id=878594739744673863",
        inline: false,
      })
      .addFields({ name: "Discord link", value: "https://discord.gg/KxadTdz", inline: false })
      .addFields({ name: "Website link", value: "https://diversitybot.onrender.com/", inline: false })
      .setFooter({ text: "Make sure the give me all the needed permissions" });

    try {
      return await interaction.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
