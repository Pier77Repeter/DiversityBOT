const { PermissionsBitField, Events, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { economySettings } = require("../config.json");
const listsGetRandomItem = require("../utils/listsGetRandomItem");
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
    if (!message.content.toLowerCase().startsWith(botPrefix) && message.content.includes("<@878594739744673863>")) {
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
            false,
          ),
        });
      } catch {
        // dont return, continue execution
      }
    }

    // re-naiming the logger, else it will keep the specific log of the command, below
    logger.setFileName("MessageCreate");

    // only updates when not restarting, even if user isn't using the bot
    if (!loader.getRestartStatus()) {
      await userDataUpdater(message).catch((error) => {
        return logger.error("UserDataUpdater threw an error, look here", error);
      });
    }

    // check if message starts with the bot prefix
    if (!message.content.toLowerCase().startsWith(botPrefix)) return;

    // check if bot is restarting, you aren't supposed to use it while it restarts
    if (loader.getRestartStatus()) {
      const embed = new EmbedBuilder()
        .setColor(0x990000)
        .setTitle("⚠️ Bot is restarting")
        .setDescription("I'm currently restarting, to preserve the integrity of your data in my database, you won't be able to use me until restart is completed.")
        .setFooter({ text: "Estimated downtime is 5 minute" });

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
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
            false,
          ),
        );
      } catch {
        return;
      }
    }

    // HERE WE ARE INSERTING NEW USER DATA (now that the user has typed an actual command)
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

    const values = [message.guildId, message.author.id, itemsJsonData, fishesJsonData];

    await client.database.query(query, values); // we inserted new data!

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
            false,
          ),
        );
      } catch {
        return;
      }
    }
  });

  // this functions contains all the shit for updating user data in db
  async function userDataUpdater(message) {
    const isLevelingEnabled = await configChecker(client, message, "leveling_cmd", false);

    // instead of using cooldownManager, we are gonna make our new one here to reduce db calls
    const unixNow = Date.now();
    const xpToAdd = isLevelingEnabled ? 1 : 0;

    // this query replaces 5 separate queries! It updates xp, checks/updates all 3 passive cooldowns, and returns the data ONLY if the user exists
    const query = `
      UPDATE users 
      SET 
        xp = xp + $1::int,
        tax_cooldown = CASE WHEN tax_cooldown + 86400000 <= $2::bigint THEN $2::bigint ELSE tax_cooldown END,
        debts_cooldown = CASE WHEN debts_cooldown + 86400000 <= $2::bigint THEN $2::bigint ELSE debts_cooldown END,
        pet_cooldown = CASE WHEN pet_cooldown + 10800000 <= $2::bigint THEN $2::bigint ELSE pet_cooldown END
      WHERE server_id = $3 AND user_id = $4
      RETURNING *;
    `;

    const res = await client.database.query(query, [xpToAdd, unixNow, message.guildId, message.author.id]);

    // user is NOT in the database, we can stop
    if (res.rowCount === 0) return;

    const user = res.rows[0];

    // LEVEL UP CHECK
    if (isLevelingEnabled && user.xp >= user.next_xp) {
      const levelRes = await client.database.query(
        "UPDATE users SET xp = 0, next_xp = next_xp + 100, level = level + 1 WHERE server_id = $1 AND user_id = $2 RETURNING level, next_xp",
        [message.guildId, message.author.id],
      );

      const newStats = levelRes.rows[0];

      const imageFile = new AttachmentBuilder("./media/levelUp.png");
      const embed = new EmbedBuilder()
        .setColor(0xffcc00)
        .setTitle("⬆️ Level up")
        .setDescription(`Your new level: **${newStats.level}**\nXP for next level: **${newStats.next_xp}**`)
        .setThumbnail("attachment://levelUp.png")
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() });

      try {
        await message.reply({ embeds: [embed], files: [imageFile] });
      } catch {
        // do nothing, continue
      }
    }

    // REPUTATION CHECK
    if (message.mentions.members.first() && message.content.toLowerCase().includes("thank")) {
      const mentionedMember = message.mentions.members.first().user;
      if (mentionedMember.id !== message.author.id && !mentionedMember.bot) {
        await client.database.query("UPDATE users SET reputation = reputation + 1 WHERE server_id = $1 AND user_id = $2", [message.guildId, mentionedMember.id]);

        const embed = new EmbedBuilder()
          .setColor(0xffcc00)
          .setTitle("🤝 So kind of you")
          .setDescription(`Gave **+1** reputation to ${mentionedMember.username}`)
          .setFooter({ text: "Check your rep with d!rep" });

        try {
          await message.reply({ embeds: [embed] });
        } catch {
          // do nothing, continue
        }
      }
    }

    // TAXES CHECK (Daily), if the db timestamp exactly matches the unixNow we generated above, it means the CASE statement triggered!
    const wealth = Number(user.money) + Number(user.bank_money);
    if (wealth > 0 && Number(user.tax_cooldown) === unixNow) {
      const taxRate = economySettings.maxTaxRate * (wealth / (wealth + economySettings.halfwayConstant));
      const taxAmount = Math.floor(economySettings.dailyEarnings * taxRate);

      await client.database.query(
        `
        UPDATE users SET 
          money = GREATEST(0::bigint, money - $1::bigint),
          bank_money = GREATEST(0::bigint, bank_money - GREATEST(0::bigint, $1::bigint - money))
        WHERE server_id = $2 AND user_id = $3;
      `,
        [taxAmount, message.guildId, message.author.id],
      );
    }

    // DEBTS CHECK (Daily)
    if (Number(user.debts) > 0 && Number(user.debts_cooldown) === unixNow) {
      const newDebts = Math.trunc((Number(user.debts) + Number(user.money) + Number(user.bank_money)) * 0.03);
      await client.database.query("UPDATE users SET debts = debts + $1 WHERE server_id = $2 AND user_id = $3", [newDebts, message.guildId, message.author.id]);
    }

    // PET CHECK (Every 3 hours)
    if (user.has_pet && Number(user.pet_cooldown) === unixNow) {
      const petRes = await client.database.query(
        `
        UPDATE users 
        SET pet_stats_health = pet_stats_health - $1, pet_stats_fun = pet_stats_fun - $2, pet_stats_hunger = pet_stats_hunger - $3, pet_stats_thirst = pet_stats_thirst - $4 
        WHERE server_id = $5 AND user_id = $6
        RETURNING pet_stats_health, pet_stats_hunger, pet_stats_thirst
      `,
        [mathRandomInt(5, 20), mathRandomInt(5, 20), mathRandomInt(5, 20), mathRandomInt(5, 20), message.guildId, message.author.id],
      );

      const livePet = petRes.rows[0];

      if (livePet.pet_stats_health <= 0 || livePet.pet_stats_hunger <= 0 || livePet.pet_stats_thirst <= 0) {
        await client.database.query(
          "UPDATE users SET has_pet = false, pet_id = NULL, pet_stats_health = 0, pet_stats_fun = 0, pet_stats_hunger = 0, pet_stats_thirst = 0 WHERE server_id = $1 AND user_id = $2",
          [message.guildId, message.author.id],
        );

        const embed = new EmbedBuilder().setColor(0xff0000).setTitle("🪦 Oh no").setDescription("Your pet sadly died, you didn't care for it enough >:(");

        try {
          await message.reply({ embeds: [embed] });
        } catch {
          // do nothing, continue with the rest
        }
      }
    }
  }
};
