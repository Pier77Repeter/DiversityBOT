const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  // slash command data (name, description), required
  data: new SlashCommandBuilder().setName("help").setDescription("Displays all the slash commands"),

  // slash command's logic
  async execute(client, interaction) {
    const helpMessageEmbed = new EmbedBuilder()
      .setColor("ff9900")
      .setTitle("Here all the available slash commands:")
      .setDescription(
        [
          // done commands
          "**/help** Display all the available commands",
          "\n",
          "**/event** Display the ongoing event",
          "\n",
          "**/news** Check Bot's news",
          "\n",
          "**/ping** Display the bot's ping",
          "\n",
          "**/server** Check server stats",
          "\n",
          "**/member** Check a member stats",
          "\n",
          "**/status** Check my stats",
          "\n",
          // commands to do
          "**/code <available language>** Makes code messages better ",
          "\n",
          "**/clean** clean messages **(Only admin, max 99)**",
          "\n",
          "**/kick** kick user from server **(Only admin)**",
          "\n",
          "**/ban** ban user from server **(Only admin)**",
          "\n",
          "**/warn** Warn an user **(Only admin)**",
          "\n",
          "**/warns** Check user warns **(Only admin)**",
          "\n",
          "**/clearwarns** Clear all the warns **(Only admin)**",
          "\n",
          "**/mute** Mutes an user **(Only admin)**",
        ].join("")
      );

    try {
      return await interaction.reply({ embeds: [helpMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
