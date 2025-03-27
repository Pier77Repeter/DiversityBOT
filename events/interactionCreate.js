const { Events, MessageFlags } = require("discord.js");
const listsGetRandomItem = require("../utils/listsGetRandomItem");

module.exports = (client) => {
  // init log format stuff
  var logPrefix = "[InteractionCreate]:";

  client.on(Events.InteractionCreate, async (interaction) => {
    // check if the interaction is a slash command
    if (!interaction.isChatInputCommand()) return;

    // get the command
    const command = client.slashCommands.get(interaction.commandName);

    // if the command doesn't exist, return
    if (!command) return;

    // ready to log for the specific slash command
    logPrefix = "[InteractionCreate/" + interaction.commandName + ".js]:";

    // if slash commands get an error log it and tell the user
    try {
      await command.execute(client, interaction);
    } catch (error) {
      console.error(logPrefix, error);

      try {
        await interaction.reply({
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
            ],
            false
          ),
          flags: MessageFlags.Ephemeral,
        });
      } catch (error) {
        return;
      }
    }
  });
};
