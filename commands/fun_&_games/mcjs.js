const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "mcjs",
  description: "Gets server information for Minecraft Java Edition",
  async execute(client, message, args) {
    const ip = args[0];

    try {
      if (!ip) return await message.reply("Give the server IP to ping like **diversitycraft.xyz**");
    } catch (error) {
      return;
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

    const embed = new EmbedBuilder()
      .setTitle(ip)
      .setDescription(
        [
          "Status: " + "`" + serverData.status + "`",
          "Version: " + "`" + serverData.server.name + "`",
          "MOTD: " + "`" + serverData.motd + "`",
          "Players: " + "`" + serverData.players.now + "/" + serverData.players.max + "`",
        ].join("\n")
      );

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
