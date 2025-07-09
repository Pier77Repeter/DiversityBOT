const { Events, MessageFlags } = require("discord.js");
const listsGetRandomItem = require("../utils/listsGetRandomItem");
const logger = require("../logger")("InteractionCreate");
const loader = require("../loader");

module.exports = (client) => {
  client.on(Events.InteractionCreate, async (interaction) => {
    // check if the interaction is a slash command
    if (!interaction.isChatInputCommand()) return;

    // get the command
    const command = client.slashCommands.get(interaction.commandName);

    // if the command doesn't exist, return
    if (!command) return;

    // re-naiming the logger, else it will keep the specific log of the command
    logger.setFileName("InteractionCreate");

    if (!loader.getRestartStatus()) {
      await oldServerChecker(interaction).catch(() => {
        return logger.error("OldServerChecker threw an error, look here ^^^");
      });

      // even when you use / cmds user data should be created IF NEW
      const row = await new Promise((resolve, reject) => {
        client.database.get("SELECT serverId, userId FROM User WHERE serverId = ? AND userId = ?", [interaction.guild.id, interaction.user.id], (err, row) => {
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
          // what the heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeel, so many values!!
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
    }

    // check if bot is restarting, you aren't supposed to use the bot while it restarts
    if (loader.getRestartStatus()) {
      try {
        return await interaction.reply({
          content:
            "I'm currently restarting, in order to preserve the integrity of your data in my database, you won't be able to use me until restart is completed",
          flags: MessageFlags.Ephemeral,
        });
      } catch (error) {
        return;
      }
    }

    // ready to log for the specific slash command
    logger.setFileName("InteractionCreate/" + interaction.commandName + ".js");

    // if slash commands get an error log it and tell the user
    try {
      await command.execute(client, interaction);
    } catch (error) {
      logger.error("Error while exeuting a slash command", error);

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

  // some servers need to kick and re-invite the bot to their server data in the new SQL db, here's the fix
  async function oldServerChecker(interaction) {
    const sRow = await new Promise((resolve, reject) => {
      client.database.get("SELECT serverId FROM Server WHERE serverId = ?", interaction.guild.id, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    // server dosen't exist because bot got invited BEFORE release 2.0
    if (!sRow) {
      await new Promise((resolve, reject) => {
        client.database.run("INSERT INTO Server VALUES (?, 1, 1, 1, 1, 'null', 0, 0, 0, 0, 0, 0)", interaction.guild.id, (err) => {
          if (err) {
            logger.error("Error while INSERTING data in db: Server '" + interaction.guild.id + "'", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  }
};
