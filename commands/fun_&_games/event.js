const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "event",
  description: "Display the ongoing Bot event",
  async execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor(0x339999)
      .setTitle("Ongoing event: None")
      .setDescription(["There are no ongoing events, check the Discord for more: https://discord.gg/KxadTdz"].join("\n"))
      .setFooter({
        text: "Sadly, no events at the moment",
      });

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
