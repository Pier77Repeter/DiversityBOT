const { Events, MessageFlags, EmbedBuilder } = require("discord.js");
const listsGetRandomItem = require("../utils/listsGetRandomItem");
const logger = require("../logger")("InteractionCreate");
const loader = require("../loader");

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
      } catch {
        return;
      }
    }

    // re-naiming the logger, else it will keep the specific log of the command
    logger.setFileName("InteractionCreate");

    // HERE WE ARE INSERTING NEW USER DATA
    // now you can S E E the json crap
    const itemsJsonData = {
      itemId1: false,
      itemId2: false,
      itemId2Count: 0,
      itemId3: false,
      itemId3Count: 0,
      itemId4: false,
      itemId5: false,
      itemId6: false,
      itemId7: false,
      itemId8: false,
      itemId9: false,
      itemId10: false,
      itemId10Count: 0,
      itemId11: false,
      itemId11Count: 0,
    };

    const fishesJsonData = {
      fishId1: false,
      fishId1Count: 0,
      fishId2: false,
      fishId2Count: 0,
      fishId3: false,
      fishId3Count: 0,
      fishId4: false,
      fishId4Count: 0,
      fishId5: false,
      fishId5Count: 0,
      fishId6: false,
      fishId6Count: 0,
      fishId7: false,
      fishId7Count: 0,
      fishId8: false,
      fishId8Count: 0,
      fishId9: false,
      fishId9Count: 0,
      fishId10: false,
      fishId10Count: 0,
    };

    // try to insert this row, if the primary key already exists, just ignore it and move on, only inserting users who actually use the bot
    // LOOK AT https://www.geeksforgeeks.org/sql/cte-in-sql/
    const query = `
      WITH server_insert AS (
        INSERT INTO servers(server_id) 
        VALUES($1) 
        ON CONFLICT (server_id) DO NOTHING
      )
      INSERT INTO users(server_id, user_id, items, fishes) 
      VALUES($1, $2, $3, $4) 
      ON CONFLICT (server_id, user_id) DO NOTHING;
    `;

    // REMEBER TO ADD THIS TEXT FOR EVENTS!!!!
    /*
    INSERT INTO events(server_id, user_id) 
    VALUES($1, $2) ON CONFLICT (server_id, user_id) DO NOTHING;
    */

    const values = [interaction.guildId, interaction.user.id, itemsJsonData, fishesJsonData];

    await client.database.query(query, values); // we inserted new data!

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
      } catch {
        return;
      }
    }
  });
};
