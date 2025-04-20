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
          "**/help** Display all the available commands",
          "**/setup** Turns on/off bot's commands",
          "**/config** See Bot's settings on the server",
          "**/event** Display the ongoing event",
          "**/news** Check Bot's news",
          "**/ping** Display the bot's ping",
          "**/server** Check server stats",
          "**/member** Check a member stats",
          "**/status** Check my stats",
          "**/link** See Bot's links, website, discord, invite link",
          // commands to do
          "**/clean** clean messages **(Only admin, max 99)**",
          "**/kick** kick user from server **(Only admin)**",
          "**/ban** ban user from server **(Only admin)**",
          "**/warn** Warn an user **(Only admin)**",
          "**/warns** Check user warns **(Only admin)**",
          "**/clearwarns** Clear all the warns **(Only admin)**",
          "**/mute** Mutes an user **(Only admin)**",
        ].join("\n")
      );

    try {
      return await interaction.reply({ embeds: [helpMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
