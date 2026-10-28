const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "link",
  description: "Bot invite link",
  async execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor(0xcc0000)
      .setTitle("🤖 Bot Links")
      .addFields({
        name: "Invite link",
        value: "https://discord.com/oauth2/authorize?client_id=878594739744673863",
        inline: false,
      })
      .addFields({ name: "Discord Link", value: "https://discord.gg/KxadTdz", inline: false })
      .addFields({ name: "Website Link", value: "https://bot.diversitycraft.org/", inline: false })
      .setFooter({ text: "Make sure the give me all the needed permissions" });

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
