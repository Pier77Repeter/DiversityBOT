const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "event",
  description: "Display the ongoing Bot event",
  async execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor(0x339999)
      .setTitle("🪩 Ongoing event: Christmas season 🎄🎅")
      .setDescription(
        [
          "⛄Event commands",
          "",
          "**d!tree or d!tree <@user>** See your Christmas tree",
          "**d!forest** Go in the forest to get some materials for the tree",
          "**d!helpsanta** Help Santa to get golden coins",
          "**d!materials** Shows all your materials that you got",
          "**d!decoshop** Shows the shop where you can buy decorations for your tree",
          "**d!buydeco <decoration name>** Buy a decoration (Automatically apply to the tree)",
        ].join("\n")
      )
      .setFooter({
        text: "Christmas season event will end on the 25th of December",
      });

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
