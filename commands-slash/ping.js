const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const delay = require("../utils/delay");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),

  async execute(client, interaction) {
    const pingMessageEmbed = new EmbedBuilder().setColor(0xff0000).setTitle("📡 Pinging, please wait...");

    var sentMessage;

    try {
      await interaction.reply({ embeds: [pingMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(3000);

    let latency = "Unknown";
    if (sentMessage?.createdTimestamp && interaction.createdTimestamp) {
      latency = `${sentMessage.createdTimestamp - interaction.createdTimestamp}ms`;
    }

    pingMessageEmbed
      .setColor(0x33ff33)
      .setTitle("🏓 Bot is functioning")
      .setDescription("I'm working as expected :P")
      .setFields({
        name: "🖥 DiversityBOT Server",
        value: `Roundtrip latency: **${latency}**\nWebsocket heartbeat: **${interaction.client.ws.ping}ms**`,
      });

    try {
      return await interaction.editReply({ embeds: [pingMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
