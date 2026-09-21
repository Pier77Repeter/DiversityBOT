const { Events, MessageFlags, EmbedBuilder } = require("discord.js");
const listsGetRandomItem = require("../utils/listsGetRandomItem");
const logger = require("../logger")("InteractionCreate");
const loader = require("../loader");
const msgErrorHandler = require("../utils/msgErrorHandler");
const createUserData = require("../utils/createUserData");

module.exports = (client) => {
  client.on(Events.InteractionCreate, async (interaction) => {
    // check if the interaction is a slash command
    if (!interaction.isChatInputCommand()) return;

    // check if the command is being sent in bot DMs
    if (!interaction.guild) return; // ghosting

    // get the command
    const command = client.slashCommands.get(interaction.commandName);

    // check if command dosen't exist
    if (!command) return;

    // check if bot is restarting, you aren't supposed to use the bot while it restarts
    if (loader.getRestartStatus()) {
      const embed = new EmbedBuilder()
        .setColor(0x990000)
        .setTitle("⚠️ Bot is restarting")
        .setDescription("I'm currently restarting, to preserve the integrity of your data in my database, you won't be able to use me until restart is completed.")
        .setFooter({ text: "Estimated downtime is 5 minute" });

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    // re-naiming the logger, else it will keep the specific log of the command
    logger.setFileName("InteractionCreate");

    // HERE WE ARE INSERTING NEW USER DATA
    await createUserData(client, interaction.guildId, interaction.user.id).catch((error) => {
      return logger.error("createUserData threw an error, look here", error);
    });

    // ready to log for the specific slash command
    logger.setFileName("InteractionCreate/" + interaction.commandName + ".js");

    // if slash commands get an error log it and tell the user
    try {
      return await command.execute(client, interaction);
    } catch (error) {
      logger.error("Error while executing a slash command", error);

      try {
        return await interaction.reply({
          content: listsGetRandomItem(
            [
              "There was an error trying to execute that command!",
              "ERROR! Command execution failed",
              "Well, that command didn't work",
              "Whoops, something went wrong",
              "rip i failed to execute your command",
              "Keeps happening? Report it here: https://discord.gg/KxadTdz",
              "Seems like there was an error in that command",
              "F, your command died.",
              "Execution stopped, report error here: https://discord.gg/KxadTdz",
              "That command encountered an unexpected issue, shit...",
              "Looks like that command hit a snag. My bad!",
              "I couldn't complete that request",
              "Failed to process your command :(",
              "Command failed successfully...",
              "My apologies! I wasn't able to execute that command as intended",
              "Please try again. If the issue persists, consider reporting it!",
              "Critical failure happened!!!",
              "An unknown error prevented that command from running",
              "Consider that command... *aborted* due to an error",
              "The command fucking died",
              "The perfect code dosen't exist, this is an example (your command got an error)",
              "your command got rekt by shitty code",
              "It's joever...",
              "Command execution got nuked, sorry",
            ],
            false,
          ),
          flags: MessageFlags.Ephemeral,
        });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }
  });
};
