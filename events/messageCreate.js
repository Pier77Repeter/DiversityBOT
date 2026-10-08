const { PermissionsBitField, Events, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const path = require("path");
const { economySettings } = require("../config.json");
const listsGetRandomItem = require("../utils/listsGetRandomItem");
const mathRandomInt = require("../utils/mathRandomInt");
const logger = require("../logger")("MessageCreate");
const loader = require("../loader");
const msgErrorHandler = require("../utils/msgErrorHandler");
const createDbData = require("../utils/createDbData");
const rng = require("../utils/rng");
const rngRarityColor = require("../utils/rngRarityColor");
const manageUserMoney = require("../utils/manageUserMoney");
const dbJsonDataSet = require("../utils/dbJsonDataSet");

module.exports = (client) => {
  // bot prefix is d!
  const botPrefix = "d!";
  const isBotRestarting = loader.getRestartStatus();

  client.on(Events.MessageCreate, async (message) => {
    // only members can use the bot
    if (message.author.bot) return;

    // check if the bot can send messages to message.channel (it's useless to use the bot if you cant interact with it)
    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages)) return;

    // check if bot gets pinged, not when you use a command like 'd!stats @DiversityBOT', no need to return
    if (!message.content.toLowerCase().startsWith(botPrefix) && message.content.includes("<@878594739744673863>")) {
      await message
        .reply({
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
        })
        .catch(msgErrorHandler);
    }

    // re-naiming the logger, else it will keep the specific log of the command, below
    logger.setFileName("MessageCreate");

    // helper function to update user stuff
    await userDataUpdater(message).catch((error) => {
      return logger.error("UserDataUpdater threw an error, look here", error);
    });

    // check if message starts with the bot prefix
    if (!message.content.toLowerCase().startsWith(botPrefix)) return;

    // check if bot is restarting, you aren't supposed to use it while it restarts
    if (isBotRestarting) {
      const embed = new EmbedBuilder()
        .setColor(0x990000)
        .setTitle("⚠️ Bot is restarting")
        .setDescription("I'm currently restarting, to preserve the integrity of your data in my database, you won't be able to use me until restart is completed.")
        .setFooter({ text: "Estimated downtime is 5 minute" });
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    // split the message into command and arguments
    const args = message.content.slice(botPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // check if the command exists (by name or alias)
    const command = client.commands.get(commandName);

    // check if the command exists
    if (!command) {
      return await message
        .reply(
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
        )
        .catch(msgErrorHandler);
    }

    // INSERTING NEW USER DATA IF NEW, look in ./utils/createDbData.js (now that the user has typed an actual command)
    await createDbData(client, message.guildId, message.author.id);

    // ready to log for the specific command
    logger.setFileName("MessageCreate/" + command.name + ".js");

    // if command gets an error, log it
    try {
      return await command.execute(client, message, args);
    } catch (error) {
      logger.error("Error while executing a message command", error);

      return await message
        .reply(
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
        )
        .catch(msgErrorHandler);
    }
  });

  // this functions contains all the shit for updating user data in db
  async function userDataUpdater(message) {
    // only update when not restarting
    if (isBotRestarting) return;

    /*
    This query is huge as fuck, does the job of multiple queries, so first in order:
    1) Find the row in the users table WHERE both server_id = message.guildId ($1) AND user_id = message.author.id ($2)
    2) Join the servers table on server_id to get the server's configs
    3) Check s.leveling_cmd from the joined server settings: add xp +1 if enabled or 0 if disabled
    4) Compare unixNow ($3) against each existing cooldown. If the required duration has experied set the field to $3 else keep the original timestamp
    5) Return all updated columns from the user row alongside the server row in a single result set. If either row doesn't exist, zero rows are affected
    */
    const unixNow = Date.now();

    const query = `
      UPDATE users u
      SET 
        xp = u.xp + (CASE WHEN s.leveling_cmd THEN 1 ELSE 0 END),
        tax_cooldown = CASE WHEN u.tax_cooldown + 86400000 <= $3::bigint THEN $3::bigint ELSE u.tax_cooldown END,
        debts_cooldown = CASE WHEN u.debts_cooldown + 86400000 <= $3::bigint THEN $3::bigint ELSE u.debts_cooldown END,
        pet_cooldown = CASE WHEN u.pet_cooldown + 10800000 <= $3::bigint THEN $3::bigint ELSE u.pet_cooldown END,
        rng_cooldown = CASE WHEN u.rng_cooldown + 3000 <= $3::bigint THEN $3::bigint ELSE u.rng_cooldown END
      FROM servers s
      WHERE u.server_id = $1 
        AND u.user_id = $2 
        AND s.server_id = u.server_id
      RETURNING u.*, s.leveling_cmd, s.rng_cmd, s.server_drops, s.rng_drop_chance;
    `;

    const res = await client.database.query(query, [message.guildId, message.author.id, unixNow]);

    // well user or server isn't it db, stop
    if (!res.rows[0]) return;

    // we have the updated user data along with server configs
    const row = res.rows[0];

    const isLevelingEnabled = row.leveling_cmd;
    const isRngEnabled = row.rng_cmd;
    const wealth = Number(row.money) + Number(row.bank_money);
    const serverDrops = row.server_drops;
    const globalDropChance = row.rng_drop_chance;
    const rngMeterSelection = row.rng_meter_selection;
    const rngMeterProgress = row.rng_meter_progress;
    const foundDrops = row.found_drops;

    // LEVEL UP CHECK
    if (isLevelingEnabled && row.xp >= row.next_xp) {
      const levelRes = await client.database.query(
        "UPDATE users SET xp = 0, next_xp = next_xp + 100, level = level + 1 WHERE server_id = $1 AND user_id = $2 RETURNING level, next_xp",
        [message.guildId, message.author.id],
      );

      const newStats = levelRes.rows[0];

      const imageFile = new AttachmentBuilder(path.join(process.cwd(), "media", "levelUp.png"), { name: "levelUp.png" });

      const embed = new EmbedBuilder()
        .setColor(0xffcc00)
        .setTitle("⬆️ Level Up")
        .setDescription(`Your new level: **${newStats.level}**\nXP for next level: **${newStats.next_xp}**`)
        .setThumbnail("attachment://levelUp.png")
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() });

      await message.reply({ embeds: [embed], files: [imageFile] }).catch(msgErrorHandler); // log and continue
    }

    // REPUTATION CHECK
    if (message.mentions.members.first() && message.content.toLowerCase().includes("thank")) {
      const mentionedMember = message.mentions.members.first().user;
      if (mentionedMember.id !== message.author.id && !mentionedMember.bot) {
        await client.database.query("UPDATE users SET reputation = reputation + 1 WHERE server_id = $1 AND user_id = $2", [message.guildId, mentionedMember.id]);

        const embed = new EmbedBuilder()
          .setColor(0xffcc00)
          .setTitle("🤝 So Kind of You")
          .setDescription(`Gave **+1** reputation to ${mentionedMember.username}`)
          .setFooter({ text: "Check your rep with d!rep" });

        await message.reply({ embeds: [embed] }).catch(msgErrorHandler); // log and continue x2
      }
    }

    // TAXES CHECK (Daily 24 hours)
    if (wealth > 0 && Number(row.tax_cooldown) === unixNow) {
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

    // DEBTS CHECK (Daily 24 hours)
    if (Number(row.debts) > 0 && Number(row.debts_cooldown) === unixNow) {
      const newDebts = Math.trunc((Number(row.debts) + Number(row.money) + Number(row.bank_money)) * 0.03);
      await client.database.query("UPDATE users SET debts = debts + $1 WHERE server_id = $2 AND user_id = $3", [newDebts, message.guildId, message.author.id]);
    }

    // PET CHECK (Every 3 hours)
    if (row.has_pet && Number(row.pet_cooldown) === unixNow) {
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

        await message.reply({ embeds: [embed] }).catch(msgErrorHandler); // log and continue x3
      }
    }

    // RNG CHECK (Every 3 seconds to prevent spam and overloading the bot with this intensive task)
    if (isRngEnabled && Number(row.rng_cooldown) === unixNow) {
      // rng meter progress must be updated first, add xp only if user has selected an item
      if (rngMeterSelection) {
        await client.database.query("UPDATE users SET rng_meter_progress = rng_meter_progress + $1 WHERE server_id = $2 AND user_id = $3", [
          message.content.startsWith("d!") ? 1.2 : 1, // using bot commands will fill the rng 20% faster than a normal message
          message.guildId,
          message.author.id,
        ]);
      }

      const eventRoll = rng();

      // no items dropped this message, since rng is the last thing we do in 'userDataUpdater()', we can actually return without issue
      if (eventRoll > globalDropChance) return;

      // if the server drop pool is already 100% we may have an overflow since meter increases the chance the closer you max it
      let totalPoolChance = 0;
      let guaranteedDrop = null;

      const drops = serverDrops.map((drop) => {
        let currentChance = drop.chance;

        if (rngMeterSelection === drop.id) {
          const effectiveChance = (globalDropChance / 100) * (drop.chance / 100);
          const maxScore = effectiveChance < 1 ? Math.ceil(1 / effectiveChance) : 1;

          // check if the rng meter is full for drop chance scaling
          if (rngMeterProgress >= maxScore) {
            currentChance = 100;
            guaranteedDrop = { ...drop, activeChance: 100 };
          } else {
            currentChance = drop.chance * (1 + 2 * (rngMeterProgress / maxScore));
          }
        }

        totalPoolChance += currentChance;
        return { ...drop, activeChance: currentChance };
      });

      let wonReward = null;

      if (guaranteedDrop) {
        wonReward = guaranteedDrop;
      } else {
        // totalPoolChance is to adjust the rng meter possible overflow
        const rollCeiling = Math.max(100, totalPoolChance);
        const itemRoll = rng(rollCeiling); // <-- May the RNG bless the message author :pray:

        let cumulativeChance = 0;

        for (const drop of drops) {
          cumulativeChance += drop.activeChance;

          if (itemRoll <= cumulativeChance) {
            wonReward = drop;
            break;
          }
        }
      }

      // by default the combined chance of the server drops dosen't reach 100%, double unlucky :(
      if (!wonReward) return;

      let isMeterDrop = false;

      // oh! dropped selected item in the meter
      if (rngMeterSelection === wonReward.id) {
        await client.database.query("UPDATE users SET rng_meter_progress = 0 WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

        isMeterDrop = true;
      }

      // we must first check if the user has found that drop already or if it's new
      if (foundDrops === null) return;

      const currentDate = new Date().toLocaleString();
      const existingItem = foundDrops.findIndex((item) => item.id === wonReward.id);

      if (existingItem !== -1) {
        foundDrops[existingItem].quantity = (foundDrops[existingItem].quantity || 1) + 1;
        foundDrops[existingItem].last_found_date = currentDate;
      } else {
        // to save space, only store the essential data we need
        foundDrops.push({
          id: wonReward.id,
          quantity: 1,
          first_found_date: currentDate,
          last_found_date: currentDate,
        });
      }

      // well we are just saving the found drop
      if ((await dbJsonDataSet(client, message, "found_drops", foundDrops, message.author.id, false)) === null) return;

      const odds = wonReward.chance;
      const embed = new EmbedBuilder();
      const meterText = isMeterDrop ? `\n\n**🎯 RNG Meter!** Reselected the **${wonReward.name}**` : "";

      // owners can setup different rewards types: role, item, money and maybe more stuff i dont know
      switch (wonReward.type) {
        case "item":
          embed.setDescription(`**${message.author.username}** just found a **${wonReward.name}**!\n\n*${wonReward.desc}*${meterText}`);
          break;

        case "money":
          embed.setDescription(`**${message.author.username}** just found a **${wonReward.name}** and got **${wonReward.money}$**!\n\n*${wonReward.desc}*${meterText}`);

          if ((await manageUserMoney(client, message, "+", wonReward.money)) === null) return;
          break;

        case "role":
          const role = message.guild.roles.cache.get(wonReward.role_id);

          // i mean, no role exists you won nothing, but still tell the user
          if (!role) {
            embed.setDescription(`**${message.author.username}** just found a role that dosen't exist!\n\n*${wonReward.desc}*${meterText}`).addFields({
              name: "IMPORTANT",
              value: `Tell the server owner that the drop with id **${wonReward.id}** does NOT have a valid role anymore and needs to be updated with a valid role`,
            });
            break;
          }

          // wasn't sure if it was better to stay silent or announce you found it twice, well better say something since we have 'quantity' attribute
          if (message.member.roles.cache.has(role.id)) {
            embed.setDescription(`**${message.author.username}** just found again the role <@&${role.id}>!\n\n*${wonReward.desc}*${meterText}`);
            break;
          }

          embed.setDescription(`**${message.author.username}** just found the role <@&${role.id}>!\n\n*${wonReward.desc}*${meterText}`);

          if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageRoles)) {
            embed.addFields({ name: "F!", value: "I'm missing `Manage Roles` permission to give you the role, ask a server mod" });
            break;
          }

          await message.member.roles.add(role).catch(() => {
            embed.addFields({ name: "Whopsy!", value: "I couldn't add you the role automatically, ask a server mod" });
          });
          break;

        // shouldn't happen?
        default:
          embed.setDescription(`**${message.author.username}** just found the ***U N K N O W N***!\n\n*${wonReward.desc}*${meterText}`);
          break;
      }

      embed.setColor(rngRarityColor(odds));

      // looks cool to make the embed dynamic to the drop's chance
      if (odds > 20) {
        embed.setTitle("🍀 RNG DROP! 🍀");
      }

      if (odds <= 20 && odds > 10) {
        embed.setTitle("🔥 RNG DROP! 🔥");
      }

      if (odds <= 10 && odds > 3) {
        embed.setTitle("✨ RNG DROP! ✨");
      }

      if (odds <= 3 && odds > 1) {
        embed.setTitle("⭐ RNG DROP! ⭐");
      }

      if (odds <= 1 && odds >= 0.1) {
        embed.setTitle("🌟 RNG DROP! 🌟");
      }

      if (odds < 0.1) {
        embed.setTitle("💫 RNG DROP! 💫");
      }

      embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) }).setTimestamp();

      await message.reply({ embeds: [embed] }).catch(msgErrorHandler); // log and finally stop
    }
  }
};
