const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "mcjs",
  description: "Gets server information for Minecraft Java Edition",
  async execute(client, message, args) {
    const ip = args[0];

    if (!ip) return await message.reply("Give the server IP to ping like **diversitycraft.org**").catch(msgErrorHandler);

    let getServerData = await fetch("https://mcapi.us/server/status?ip=" + ip);
    let serverData = await getServerData.json();

    if (serverData.status == "error") {
      return await message.reply("Server is unreachable, or you just sent an invalid IP").catch(msgErrorHandler);
    }

    const embed = new EmbedBuilder()
      .setTitle(ip)
      .setDescription(
        [
          `Status: \`${serverData.status}\``,
          `Version: \`${serverData.server.name}\``,
          `MOTD: \`${serverData.motd}\``,
          `Players: \`${serverData.players.now}/${serverData.players.max}\``,
        ].join("\n"),
      );

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
