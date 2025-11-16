const { Events, MessageFlags, EmbedBuilder } = require("discord.js");
const listsGetRandomItem = require("../utils/listsGetRandomItem");
const logger = require("../logger")("InteractionCreate");
const loader = require("../loader");

module.exports = (client) => {
  client.on(Events.InteractionCreate, async (interaction) => {
    // check if the interaction is a slash command
    if (!interaction.isChatInputCommand()) return;

    // check if the command is being sent in bot DMs
    if (!interaction.guild) {
      try {
        return await interaction.reply("I can only be used in servers, i don't reply in DMs");
      } catch (error) {
        return;
      }
    }

    // get the command
    const command = client.slashCommands.get(interaction.commandName);

    // check if command dosen't exist
    if (!command) return;

    // check if bot is restarting, you aren't supposed to use the bot while it restarts
    if (loader.getRestartStatus()) {
      const embed = new EmbedBuilder()
        .setColor(0x990000)
        .setTitle("⚠️ Bot is restarting")
        .setDescription(
          "I'm currently restarting, in order to preserve the integrity of your data in my database, you won't be able to use me until restart is completed."
        )
        .setFooter({ text: "Estimated downtime is 5 minute" });

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return;
      }
    }

    // re-naiming the logger, else it will keep the specific log of the command
    logger.setFileName("InteractionCreate");

    await serverDataChecker(interaction).catch((err) => {
      return logger.error("ServerDataChecker threw an error", err);
    });

    // even when you use / cmds user data should be created IF NEW
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT 1 FROM User WHERE serverId = ? AND userId = ?", [interaction.guild.id, interaction.user.id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    // if it's new user, insert the default data in db
    if (!row) {
      const itemsJsonData =
        '{"itemId1": false, "itemId2": false, "itemId2Count": 0, "itemId3": false, "itemId3Count": 0, "itemId4": false, "itemId5": false, "itemId6": false, "itemId7": false, "itemId8": false, "itemId9": false, "itemId10": false, "itemId10Count": 0, "itemId11": false, "itemId11Count": 0}';
      const fishesJsonData =
        '{"fishId1": false, "fishId1Count": 0, "fishId2": false, "fishId2Count": 0, "fishId3": false, "fishId3Count": 0, "fishId4": false, "fishId4Count": 0, "fishId5": false, "fishId5Count": 0, "fishId6": false, "fishId6Count": 0, "fishId7": false, "fishId7Count": 0, "fishId8": false, "fishId8Count": 0, "fishId9": false, "fishId9Count": 0, "fishId10": false, "fishId10Count": 0}';

      await new Promise((resolve, reject) => {
        // so many values!
        client.database.run(
          "INSERT INTO User VALUES (?, ?, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, ?, ?, 'null', 0, 'null', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);",
          [interaction.guild.id, interaction.user.id, itemsJsonData, fishesJsonData],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    // ready to log for the specific slash command
    logger.setFileName("InteractionCreate/" + interaction.commandName + ".js");

    // if slash commands get an error log it and tell the user
    try {
      await command.execute(client, interaction);
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
            false
          ),
          flags: MessageFlags.Ephemeral,
        });
      } catch (error) {
        return;
      }
    }
  });

  // VERY RARELY, the bot may be invited in a server when db connection is off (bot is offline) and data isn't created, this is the fix
  async function serverDataChecker(interaction) {
    const serverRow = await new Promise((resolve, reject) => {
      client.database.get("SELECT 1 FROM Server WHERE serverId = ?", interaction.guild.id, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (serverRow) return; // server already exist

    await new Promise((resolve, reject) => {
      client.database.run("INSERT INTO Server VALUES (?, 1, 1, 1, 1, 1, 'null', 0, 0, 0, 0, 0, 0)", interaction.guild.id, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
};
