const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../utils/msgErrorHandler");

module.exports = {
  data: new SlashCommandBuilder().setName("event").setDescription("Display the ongoing Bot event"),

  async execute(client, interaction) {
    //.setColor(0x339999).setTitle("🪩 Ongoing event: None").setDescription("There are currently no events going on");

    const embed = new EmbedBuilder()
      .setTitle("🪩 Ongoing event: Christmas Season 🎄🎅")
      .setDescription(
        [
          "**d!tree or d!tree <@user>** See your Christmas tree",
          "**d!forest** Collect the materials to build the tree",
          "**d!helpsanta** Help Santa to get golden coins",
          "**d!materials** Shows all your materials that you got",
          "**d!decoshop** Shows the shop where you can buy decorations for your tree",
          "**d!buydeco <decorationName>** Buy a decoration (Automatically apply to the tree)",
        ].join("\n"),
      )
      .setFooter({
        text: "Christmas Season event will end on the 25th of December",
      });

    return await interaction.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
