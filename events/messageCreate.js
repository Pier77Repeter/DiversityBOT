const { PermissionsBitField, Events, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const listsGetRandomItem = require("../utils/listsGetRandomItem");
const cooldownManager = require("../utils/cooldownManager");
const mathRandomInt = require("../utils/mathRandomInt");
const logger = require("../logger")("MessageCreate");
const loader = require("../loader");

module.exports = (client) => {
  // bot prefix is d!
  const botPrefix = "d!";

  client.on(Events.MessageCreate, async (message) => {
    // only members can use the bot, not other bots
    if (message.author.bot) return;

    // check if the bot can send messages to the message.channel (it's useless to use the bot if you cant interact with it)
    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages)) return;

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
            ],
            false
          ),
        });
      } catch (error) {
        // dont return just do nothing
      }
    }

    // re-naiming the logger, else it will keep the specific log of the command, below
    logger.setFileName("MessageCreate");

    // calling updaters when bot isn't restarting
    if (!loader.getRestartStatus()) {
      await xpUpdater(message).catch((err) => {
        return logger.error("XpUpdater threw an error", err);
      });
      await repUpdater(message).catch((err) => {
        return logger.error("RepUpdater threw an error", err);
      });
      await debtsUpdater(message).catch((err) => {
        return logger.error("DebtsUpdater threw an error", err);
      });
      await petStatsUpdater(message).catch((err) => {
        return logger.error("PetStatsUpdater threw an error", err);
      });
    }

    // check if the message starts with the bot prefix
    if (!message.content.toLowerCase().startsWith(botPrefix)) return;

    // check if bot is restarting, you aren't supposed to use the bot while it restarts
    if (loader.getRestartStatus()) {
      try {
        return await message.reply(
          "I'm currently restarting, in order to preserve the integrity of your data in my database, you won't be able to use me until restart is completed"
        );
      } catch (error) {
        return;
      }
    }

    // client.database setting up user data
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT serverId, userId FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    // if it's new create the new row
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
      await command.execute(client, message, args);
    } catch (error) {
      logger.error("Error while executing a message command", error);

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

  async function xpUpdater(message) {
    const xpRow = await new Promise((resolve, reject) => {
      client.database.get("SELECT xp, nextXp, level FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // if user exists
    if (xpRow) {
      await new Promise((resolve, reject) => {
        client.database.run("UPDATE User SET xp = xp + 1 WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      if (xpRow.xp >= xpRow.nextXp) {
        await new Promise((resolve, reject) => {
          client.database.serialize(function () {
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
        const newLevelMessageEmbed = new EmbedBuilder()
          .setColor(0xffcc00)
          .setTitle("⬆️ Level up")
          .setDescription(["Your new level: **" + (xpRow.level + 1) + "**", "XP for next level: **" + (xpRow.nextXp + 100) + "**"].join("\n"))
          .setThumbnail("attachment://levelUp.png")
          .setFooter({
            text: message.author.username,
            iconURL: message.author.displayAvatarURL(),
          });

        try {
          await message.reply({ embeds: [newLevelMessageEmbed], files: [imageFile] });
        } catch (error) {
          // contiue
        }
      }
    }
  }

  async function repUpdater(message) {
    if (message.mentions.members.first() != null && message.content.toLowerCase().includes("thank")) {
      const mentionedMember = message.mentions.members.first().user;

      const row = await new Promise((resolve, reject) => {
        client.database.get("SELECT reputation FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, mentionedMember.id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      // if user exists
      if (row) {
        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE User SET reputation = reputation + 1 WHERE serverId = ? AND userId = ?",
            [message.guild.id, mentionedMember.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        try {
          await message.reply("Gave **+1** reputation to " + mentionedMember.username);
        } catch (error) {
          // do nothing, continue
        }
      }
    }
  }

  async function debtsUpdater(message) {
    const debtRow = await new Promise((resolve, reject) => {
      client.database.get("SELECT debts, money, bankMoney FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // what if it dosen't exist????
    if (debtRow && debtRow.debts > 0) {
      const debtsCooldown = await cooldownManager(client, message, "debtsCooldown", 86400, false);
      if (debtsCooldown == null) return;

      // updating the debts
      if (debtsCooldown == 0) {
        const debts = debtRow.debts + (debtRow.money + debtRow.bankMoney) * 0.01;

        await new Promise((resolve, reject) => {
          client.database.run("UPDATE User SET debts = ? WHERE serverId = ? AND userId = ?", [debts, message.guild.id, message.author.id], (err) => {
            if (err) reject(err);
            resolve();
          });
        });
      }
    }
  }

  async function petStatsUpdater(message) {
    const petRow = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT hasPet, petStatsHealth, petStatsFun, petStatsHunger, petStatsThirst, petCooldown FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, message.author.id],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });

    if (petRow) {
      if (petRow.hasPet) {
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
        if (petRow.petStatsHealth <= 0 || petRow.petStatsHunger <= 0 || petRow.petStatsThirst <= 0) {
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

          const petMessageEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("🪦 Oh no")
            .setDescription("Your pet sadly died, you didn't care for it enough >:(");

          try {
            await message.reply({ embeds: [petMessageEmbed] });
          } catch (error) {
            // do nothing, continue
          }
        }
      }
    }
  }
};
