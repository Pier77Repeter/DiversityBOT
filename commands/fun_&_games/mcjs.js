const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "mcjs",
  description: "Gets server information for Minecraft Java Edition",
  async execute(client, message, args) {
    const ip = args[0];

    if (!ip) {
      try {
        return await message.reply("Give the server IP to ping");
      } catch (error) {
        return;
      }
    }

    var getServerData = await fetch("https://mcapi.us/server/status?ip=" + ip);
    var serverData = await getServerData.json();

    if (serverData.status == "error") {
      try {
        return await message.reply("Server is unreachable, or you just sent an invalid IP");
      } catch (error) {
        return;
      }
    }

    const mcjsMessageEmbed = new EmbedBuilder()
      .setTitle(serverData.server.name)
      .setDescription(
        [
          "Status: " + "`" + serverData.status + "`",
          "\n",
          "IP: " + "`" + ip + "`",
          "\n",
          "MOTD: " + "`" + serverData.motd + "`",
          "\n",
          "Players: " + "`" + serverData.players.now + "/" + serverData.players.max + "`",
        ].join(" ")
      );

    try {
      return await message.reply({ embeds: [mcjsMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
