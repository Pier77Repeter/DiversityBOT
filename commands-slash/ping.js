const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const delay = require("../utils/delay");
const msgErrorHandler = require("../utils/msgErrorHandler");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),

  async execute(client, interaction) {
    const embed = new EmbedBuilder().setColor(0xff0000).setTitle("📡 Pinging, please wait...");

    const sentMessage = await interaction.reply({ embeds: [embed] }).catch(msgErrorHandler);

    await delay(3000);

    let latency = "Unknown";

    if (sentMessage?.createdTimestamp && interaction.createdTimestamp) {
      latency = `${sentMessage.createdTimestamp - interaction.createdTimestamp}ms`;
    }

    embed
      .setColor(0x33ff33)
      .setTitle("🏓 Bot is Functioning")
      .setDescription("I'm working as expected :P")
      .setFields({
        name: "🖥 DiversityBOT Server",
        value: `Roundtrip latency: **${latency}**\nWebsocket heartbeat: **${interaction.client.ws.ping}ms**`,
      });

    interaction.editReply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
