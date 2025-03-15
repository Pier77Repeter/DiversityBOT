const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),

  async execute(client, interaction) {
    const sent = await interaction.reply({ content: "Pinging...", withResponse: true });
    let latency = "Unknown";
    if (sent?.createdTimestamp && interaction.createdTimestamp) {
      latency = `${sent.createdTimestamp - interaction.createdTimestamp}ms`;
    }

    try {
      return await interaction.editReply(`Roundtrip latency: ${latency}\nWebsocket heartbeat: ${interaction.client.ws.ping}ms`);
    } catch (error) {
      return;
    }
  },
};
