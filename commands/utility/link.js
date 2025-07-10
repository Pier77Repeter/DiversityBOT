const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "link",
  description: "Bot invite link",
  async execute(client, message, args) {
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
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
