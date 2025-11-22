const { PermissionsBitField, Events, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const listsGetRandomItem = require("../utils/listsGetRandomItem");
const cooldownManager = require("../utils/cooldownManager");
const mathRandomInt = require("../utils/mathRandomInt");
const configChecker = require("../utils/configChecker");
const logger = require("../logger")("MessageCreate");
const loader = require("../loader");

module.exports = (client) => {
  // bot prefix is d!
  const botPrefix = "d!";

  client.on(Events.MessageCreate, async (message) => {
    // only members can use the bot
    if (message.author.bot) return;

    // check if the bot can send messages to message.channel (it's useless to use the bot if you cant interact with it)
    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages)) return;

    // check if bot gets pinged, not when you use a command like 'd!stats @DiversityBOT'
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
              "https://c.tenor.com/O3GWEV35QfsAAAAd/tenor.gif",
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
              "Did you just ping me?",
              "I heard that!",
              "Is there something you need, or are you just testing my patience?",
              "I'M FRICKING OOOOOOOOONNLIIIIIIIIIIIINEEEEEEEEEEEEEE",
              "BEEP BOOP!",
              "One ping only, please",
              "I'm not a cat, you don't need to get my attention like that",
              ">:(",
              "My inbox is not your playground",
              "If you're bored, try d!play!",
              "I'm here, I'm here! No need to shout",
              "You rang?",
              "Please use commands, not pings",
              "RRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
              "Is this an emergency? Or just a ping?",
              "Still here. Still annoyed.",
              "Did you forget a command?",
              "bruh",
              "Just because you can, doesn't mean you should",
              "Did you just ping me?",
              "I'm awake, no need to shout!",
              "Is there something important?",
              "My ears are ringing!",
              "What's up?",
              "You called?",
              "Leave me alone!",
              "Can I help you?",
              "I'm right here.",
              "Seriously?",
              "Why ping when you can type?",
              "I'm trying to nap",
              "I'm watching you...",
              "I'm not your personal assistant",
              "Go on, say something useful",
              "Is this a joke?",
              "I'm not amused",
              "Just use a command already!",
              "I'm busy plotting world domination",
              "Stop poking me!",
              "I'm not ignoring you, I'm just busy",
              "What's your emergency?",
              "I'm not a fucking therapist!!!",
            ],
            false
          ),
        });
      } catch (error) {
        // dont return, continue execution
      }
    }

    // re-naiming the logger, else it will keep the specific log of the command, below
    logger.setFileName("MessageCreate");

    // can't do const, db operations needs to be done when bot isn't restarting
    var row;

    // calling updaters when bot isn't restarting
    if (!loader.getRestartStatus()) {
      await serverDataChecker(message).catch((err) => {
        return logger.error("ServerDataChecker threw an error, look here", err);
      });

      // checking if user exists in db, very fast query, will return '{ '1': 1 }' if row is found
      row = await new Promise((resolve, reject) => {
        client.database.get("SELECT 1 FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });

      // the user exists, so update his shit
      if (row) {
        await userDataUpdater(message).catch((err) => {
          return logger.error("UserDataUpdater threw an error, look here", err);
        });
      }
    }

    // check if message starts with the bot prefix
    if (!message.content.toLowerCase().startsWith(botPrefix)) return;

    // check if bot is restarting, you aren't supposed to use it while it restarts
    if (loader.getRestartStatus()) {
      const embed = new EmbedBuilder()
        .setColor(0x990000)
        .setTitle("⚠️ Bot is restarting")
        .setDescription(
          "I'm currently restarting, in order to preserve the integrity of your data in my database, you won't be able to use me until restart is completed."
        )
        .setFooter({ text: "Estimated downtime is 5 minute" });

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    // if it's new user, insert the default data in db, i put this here so that only people who actually use the bot gets stored in db (less junk)
    if (!row) {
      const itemsJsonData =
        '{"itemId1": false, "itemId2": false, "itemId2Count": 0, "itemId3": false, "itemId3Count": 0, "itemId4": false, "itemId5": false, "itemId6": false, "itemId7": false, "itemId8": false, "itemId9": false, "itemId10": false, "itemId10Count": 0, "itemId11": false, "itemId11Count": 0}';
      const fishesJsonData =
        '{"fishId1": false, "fishId1Count": 0, "fishId2": false, "fishId2Count": 0, "fishId3": false, "fishId3Count": 0, "fishId4": false, "fishId4Count": 0, "fishId5": false, "fishId5Count": 0, "fishId6": false, "fishId6Count": 0, "fishId7": false, "fishId7Count": 0, "fishId8": false, "fishId8Count": 0, "fishId9": false, "fishId9Count": 0, "fishId10": false, "fishId10Count": 0}';

      await new Promise((resolve, reject) => {
        // what the heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeel, so many values!!
        client.database.run(
          "INSERT INTO User VALUES (?, ?, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, ?, ?, 'null', 0, 'null', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);",
          [message.guild.id, message.author.id, itemsJsonData, fishesJsonData],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    // last but not least, event data, put this for the same reason as this ^
    await userEventDataChecker(message).catch((err) => {
      return logger.error("UserEventDataChecker threw an error, look here", err);
    });

    // split the message into command and arguments
    const args = message.content.slice(botPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // check if the command exists (by name or alias)
    const command = client.commands.get(commandName);

    // check if the command exists
    if (!command) {
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
              "Hmm, i've never seen " + commandName + " before. Did you mean something else?",
              "That's not in my dictionary. Try d!help for a list of valid commands",
              "Access denied: Unknown command. Please consult d!help.",
              "Are you speaking a foreign language? That's not a command i understand!",
              "Command `" + commandName + "` not found, perhaps it's a typo?",
              "My database is unable to locate `" + commandName + "`. Use **d!help**",
              "Did you just make that up? Because I don't know that command",
              "Error 404: Command not found. Have you tried **d!help**?",
              "I'm afraid i can't do that. That's not a command.",
              "Is that a command? My systems say no",
              "I'm not sure what " + commandName + " means...",
              "I am not familiar with the command you provided",
              "Please use a command that exists. Like **d!help**!",
              "I prefer commands that actually do something",
              "If you're trying to break me, you'll need a real command first",
              "That's a new one! Unfortunately, I don't know that",
              "Invalid command, human! Go d!help yourself!",
              "Are you sure that's a command?",
              "I only respond to proper commands",
              "Did you make that command up?",
              "Access denied. Command not recognized",
              "Syntax error: Command not defined, you stupid",
              "I'm not familiar with that operation",
              "My command list is very exclusive, and that's not on it",
              "That command is a mystery to me. And I know everything.",
              "My response to that command is: 'What?'",
            ],
            false
          )
        );
      } catch (error) {
        return;
      }
    }

    // ready to log for the specific command
    logger.setFileName("MessageCreate/" + command.name + ".js");

    // if command gets an error, log it
    try {
      return await command.execute(client, message, args);
    } catch (error) {
      logger.error("Error while executing a message command", error);

      try {
        return await message.reply(
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
          )
        );
      } catch (error) {
        return;
      }
    }
  });

  // VERY RARELY, the bot may be invited in a server when db connection is off (bot is offline) and data isn't created, this is the fix
  async function serverDataChecker(message) {
    const serverRow = await new Promise((resolve, reject) => {
      client.database.get("SELECT 1 FROM Server WHERE serverId = ?", message.guild.id, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (serverRow) return; // server already exist

    await new Promise((resolve, reject) => {
      client.database.run("INSERT INTO Server VALUES (?, 1, 1, 1, 1, 1, 'null', 0, 0, 0, 0, 0, 0)", message.guild.id, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  // this functions contains all the shit for updating user data in db
  async function userDataUpdater(message) {
    // selecting the data that needs to be updated EVERYTIME THE USER SENDS A NEW MESSAGE
    const userRow = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT xp, nextXp, level, reputation, debts, money, bankMoney, hasPet, petStatsHealth, petStatsFun, petStatsHunger, petStatsThirst, petCooldown FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, message.author.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    const isLevelingEnabled = await configChecker(client, message, "levelingCmd");

    const embed = new EmbedBuilder();

    // XP UPDATING SECTION, working with data: xp, nextXp, level
    if (isLevelingEnabled) {
      await new Promise((resolve, reject) => {
        client.database.run("UPDATE User SET xp = xp + 1 WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // check if user can progress to the next level
      if (userRow.xp >= userRow.nextXp) {
        await new Promise((resolve, reject) => {
          client.database.serialize(() => {
            client.database.run("UPDATE User SET xp = 0 WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err) => {
              if (err) reject(err);
              else resolve();
            });

            client.database.run("UPDATE User SET nextXp = nextXp + 100 WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err) => {
              if (err) reject(err);
              else resolve();
            });

            client.database.run("UPDATE User SET level = level + 1 WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        });

        const imageFile = new AttachmentBuilder("./media/levelUp.png");

        embed
          .setColor(0xffcc00)
          .setTitle("⬆️ Level up")
          .setDescription(["Your new level: **" + (userRow.level + 1) + "**", "XP for next level: **" + (userRow.nextXp + 100) + "**"].join("\n"))
          .setThumbnail("attachment://levelUp.png")
          .setFooter({
            text: message.author.username,
            iconURL: message.author.displayAvatarURL(),
          });

        try {
          await message.reply({ embeds: [embed], files: [imageFile] });
        } catch (error) {
          // contiue to update the rest of the data
        }
      }
    }

    // REPUTATION UPDATING SECTION, only needed with when mentioned user and word "thank" is present in message, working with data: reputation
    if (message.mentions.members.first() != null && message.content.toLowerCase().includes("thank")) {
      const mentionedMember = message.mentions.members.first().user;

      await new Promise((resolve, reject) => {
        client.database.run("UPDATE User SET reputation = reputation + 1 WHERE serverId = ? AND userId = ?", [message.guild.id, mentionedMember.id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      embed
        .setColor(0xffcc00)
        .setTitle("🤝 So kind of you")
        .setDescription("Gave **+1** reputation to " + mentionedMember.username)
        .setFooter({ text: "Check you rep with d!rep" });

      try {
        await message.reply({ embeds: [embed] });
      } catch (error) {
        // contiue to update the rest of the data
      }
    }

    // DEBTS UPDATING SECTION, only needed when user has debts, working with data: debts, money, bankMoney
    if (userRow.debts > 0) {
      const debtsCooldown = await cooldownManager(client, message, "debtsCooldown", 86400, false); // we don't wanna log any error (spam prevention)
      if (debtsCooldown == null) return;

      // updating the debts
      if (debtsCooldown == 0) {
        const debts = Math.trunc((userRow.debts + userRow.money + userRow.bankMoney) * 0.05); // add 5% every day, and prevents floats

        await new Promise((resolve, reject) => {
          client.database.run("UPDATE User SET debts = ? WHERE serverId = ? AND userId = ?", [debts, message.guild.id, message.author.id], (err) => {
            if (err) reject(err);
            resolve();
          });
        });
      }
    }

    // PET STATS UPDATING SECTION, only needed when user has a pet, working with data: hasPet, petStatsHealth, petStatsFun, petStatsHunger, petStatsThirst, petCooldown
    if (userRow.hasPet) {
      const petCooldown = await cooldownManager(client, message, "petCooldown", 10800, false);
      if (petCooldown == null) return;

      // updating the stats
      if (petCooldown == 0) {
        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE User SET petStatsHealth = petStatsHealth - ?, petStatsFun = petStatsFun - ?, petStatsHunger = petStatsHunger - ?, petStatsThirst = petStatsThirst - ? WHERE serverId = ? AND userId = ?",
            [mathRandomInt(5, 20), mathRandomInt(5, 20), mathRandomInt(5, 20), mathRandomInt(5, 20), message.guild.id, message.author.id],
            (err) => {
              if (err) reject(err);
              resolve();
            }
          );
        });
      }

      // check if pet is still alive
      if (userRow.petStatsHealth <= 0 || userRow.petStatsHunger <= 0 || userRow.petStatsThirst <= 0) {
        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE User SET hasPet = 0, petId = 'null', petStatsHealth = 0, petStatsFun = 0, petStatsHunger = 0, petStatsThirst = 0 WHERE serverId = ? AND userId = ?",
            [message.guild.id, message.author.id],
            (err) => {
              if (err) reject(err);
              resolve();
            }
          );
        });

        embed.setColor(0xff0000).setTitle("🪦 Oh no").setDescription("Your pet sadly died, you didn't care for it enough >:(");

        try {
          await message.reply({ embeds: [embed] });
        } catch (error) {
          // do nothing...
        }
      }
    }
  }

  // for bot events data
  async function userEventDataChecker(message) {
    row = await new Promise((resolve, reject) => {
      client.database.get("SELECT 1 FROM Event WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) {
      await new Promise((resolve, reject) => {
        client.database.run("INSERT INTO Event VALUES (?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);", [message.guild.id, message.author.id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  }
};
