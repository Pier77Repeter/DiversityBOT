const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  // slash command data (name, description), required
  data: new SlashCommandBuilder().setName("help").setDescription("Displays all the slash commands"),

  // slash command's logic
  async execute(client, interaction) {
    const embed = new EmbedBuilder()
      .setColor(0xff9900)
      .setTitle("📒 List of all available slash commands")
      .setDescription(
        [
          "**/help** - Display all the available slash commands",
          "**/config** - See Bot's settings on the server",
          "**/setup** - Turns on/off bot's commands",
          "**/modlog** - Setup the channel for logging mod actions",
          "**/kick** - Kick user from server **(Only admin)**",
          "**/ban** - Ban user from server **(Only admin)**",
          "**/unban** - Unban user from server **(Only admin)**",
          "**/mute** - Mutes an user **(Only admin)**",
          "**/unmute** - Unmutes an user **(Only admin)**",
          "**/clean** - Clean messages from the channel **(Only admin)**",
          "**/warn** - Warn an user **(Only admin)**",
          "**/warns** - Check or clear user warns **(Only admin)**",
          "**/event** - Display the ongoing event",
          "**/news** - Check Bot's news",
          "**/server** - Check server stats",
          "**/member** - Check a member stats",
          "**/status** - Check my stats",
          "**/link** - See Bot's links, website, discord, invite link",
          "**/ping** - Display the bot's ping",
        ].join("\n")
      );

    try {
      return await interaction.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
