const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("link").setDescription("Displays all links for the Bot"),

  async execute(client, interaction) {
    const linkMessageEmbed = new EmbedBuilder()
      .setColor("cc0000")
      .setTitle("🤖 Bot links")
      .addFields({
        name: "Invite link",
        value: "https://discord.com/api/oauth2/authorize?client_id=878594739744673863&permissions=2080948874566&scope=bot",
        inline: false,
      })
      .addFields({ name: "Discord link", value: "https://discord.gg/KxadTdz", inline: false })
      .addFields({ name: "Website link", value: "https://diversitybot.onrender.com/", inline: false });

    try {
      return await interaction.reply({ embeds: [linkMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
