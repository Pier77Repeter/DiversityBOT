const { PermissionsBitField, Events } = require("discord.js");
const listsGetRandomItem = require("../utils/listsGetRandomItem");

module.exports = (client) => {
  // prefix and init log format stuff
  const botPrefix = "d!";
  var logPrefix = "[MessageCreate]:";

  client.on(Events.MessageCreate, async (message) => {
    // only members can use the bot, not other bots
    if (message.author.bot) return;

    // check if the bot can send messages to the message.channel (it's useless to use the bot if you cant interact with it)
    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages)) return;

    // check for reputation
    if (message.mentions.members.first() != null && message.content.toLowerCase().includes("thank")) {
      const member = message.mentions.members.first().user;

      const row = await new Promise((resolve, reject) => {
        client.database.get(
          "SELECT * FROM User WHERE serverId = ? AND userId = ?",
          [message.guild.id, member.id],
          (err, row) => {
            if (err) {
              console.log(logPrefix + "Error: " + err);
              reject(err);
            } else {
              resolve(row);
            }
          }
        );
      });

      // check if user exists
      if (row) {
        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE User SET reputation = reputation + 1 WHERE serverId = ? AND userId = ?",
            [message.guild.id, member.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        try {
          await message.reply("Gave **+1** reputation to " + member.username);
        } catch (error) {
          // do nothing, continue
        }
      }
    }

    // check if bot gets pinged
    if (message.mentions.has(client.user) && !message.content.toLowerCase().startsWith(botPrefix)) {
      try {
        await message.reply({
          content: listsGetRandomItem(
            [
              "What do you want?",
              "Don't ping me",
              "Stop",
              "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "mh?",
              "can you like STOP",
              "Need me? I'm online",
              "d!help in case you need me",
              "i'm here already",
              "HEEEEEEEEEEEEELLLLLLLLOOOOOOOOOOOOOOOOOOOOOOOOOO",
              "https://cdn.discordapp.com/attachments/1332347523725004901/1340726430069166191/scream-meme-song-wild-west.gif?ex=67b3684a&is=67b216ca&hm=c4f53f38d6ce2a3e390fdcf06b968dcb4c61708dd0e36e0fa99be4e19d4b5a09&",
              "Will you shut up!?",
              "Let me work in peace...",
              "Again?!",
              "It's getting annoying",
              "Why won't you stop!!",
              ":facepalm: i'm done with you",
              "Busy",
              "If you need anything just d!help",
              "Don't ping, instead do d!help",
              "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH",
              "https://youtu.be/yBLdQ1a4-JI",
              "How about you join DiversityCraft",
              "Shut.the.fuck.up",
              "Trying to be productive, unlike you, so don't distrub",
            ],
            false
          ),
        });
      } catch (error) {
        // dont return just do nothing
      }
    }

    // check if the message starts with the bot prefix
    if (!message.content.toLowerCase().startsWith(botPrefix)) return;

    // client.database setting up user data
    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT * FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, message.author.id],
        (err, row) => {
          if (err) {
            console.log(logPrefix + "Error: " + err);
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    // check if it's new and INSERT
    if (!row) {
      await new Promise((resolve, reject) => {
        const itemsJsonData =
          '{"itemId1": false, "itemId2": false, "itemId2Count": 0, "itemId3": false, "itemId3Count": 0, "itemId4": false, "itemId5": false, "itemId6": false, "itemId7": false, "itemId8": false, "itemId9": false, "itemId10": false, "itemId10Count": 0, "itemId11": false, "itemId11Count": 0}';
        const fishesJsonData =
          '{"fishId1": false, "fishId1Count": 0, "fishId2": false, "fishId2Count": 0, "fishId3": false, "fishId3Count": 0, "fishId4": false, "fishId4Count": 0, "fishId5": false, "fishId5Count": 0, "fishId6": false, "fishId6Count": 0, "fishId7": false, "fishId7Count": 0, "fishId8": false, "fishId8Count": 0, "fishId9": false, "fishId9Count": 0, "fishId10": false, "fishId10Count": 0}';
        client.database.run(
          "INSERT INTO User VALUES (?, ?, 0, 0, 0, 0, 0, 0, 0, 0, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)",
          [message.guild.id, message.author.id, itemsJsonData, fishesJsonData],
          (err) => {
            if (err) {
              console.log(logPrefix + "Error: " + err);
              return reject(err);
            }
          }
        );

        resolve();
      });
    }

    // split the message into command and arguments
    const args = message.content.slice(botPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // check if the command exists
    if (!client.commands.has(commandName)) {
      try {
        return await message.reply(
          listsGetRandomItem(
            [
              "That command doesn't exist, type d!help",
              "What? I don't recognize this",
              "Funny, not one of my commands",
              "Try again, maybe with an actual command",
              "Oh hell nah i'm not gonna execute that",
              "What",
              "Okay but that dosen't look like a command i know",
              "Unknown command, type d!help for more",
              "Error: Command isn't registred",
              "YOU TYPE D!HELP NOW!!!",
              "I'm sorry, i don't recognize: " + commandName,
            ],
            false
          )
        );
      } catch (error) {
        return;
      }
    }

    // ready to log for the specific command
    logPrefix = "[MessageCreate/" + commandName + ".js]:";

    // get the command
    const command = client.commands.get(commandName);

    // if command gets an error, log it (buggy)
    try {
      await command.execute(client, message, args);
    } catch (error) {
      console.error(logPrefix, error);
      try {
        await message.reply(
          listsGetRandomItem(
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
          )
        );
      } catch (error) {
        return;
      }
    }
  });
};
