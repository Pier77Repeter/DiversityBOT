const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const rng = require("./rng");
const dbJsonDataGet = require("./dbJsonDataGet");
const dbJsonDataSet = require("./dbJsonDataSet");
const manageUserMoney = require("./manageUserMoney");
const msgErrorHandler = require("./msgErrorHandler");
const rngRarityColor = require("./rngRarityColor");

// This file will be moved to messageCreate.js as a function, this is NOT an utility file

// it works by doing 2 rolls, 1 for dropping an item, 2 for dropping X item
module.exports = async function rngItemRoll(client, message, serverDrops, globalDropRate) {
  // rng meter progress must be updated first
  const row = await client.database.query("SELECT rng_meter_selection, rng_meter_progress FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);
  let userMeter = row.rows[0] || { rng_meter_selection: null, rng_meter_progress: 0 };

  // add xp only if user has selected an item
  if (userMeter.rng_meter_selection) {
    await client.database.query("UPDATE users SET rng_meter_progress = rng_meter_progress + $1 WHERE server_id = $2 AND user_id = $3", [
      message.content.startsWith("d!") ? 1.2 : 1, // using bot commands will fill the rng 20% faster than a normal message
      message.guildId,
      message.author.id,
    ]);
  }

  const eventRoll = rng();
  if (eventRoll > globalDropRate) return; // no items dropped this message :(

  // if the server drop pool is already 100% we may have an overflow since meter increases the chance the closer you max it
  let totalPoolChance = 0;
  let guaranteedDrop = null;

  const drops = serverDrops.map((drop) => {
    let currentChance = drop.chance;

    if (userMeter.rng_meter_selection === drop.id) {
      const effectiveChance = (globalDropRate / 100) * (drop.chance / 100);
      const maxScore = effectiveChance < 1 ? Math.ceil(1 / effectiveChance) : 1;

      // check if the rng meter is full for drop chance scaling
      if (userMeter.rng_meter_progress >= maxScore) {
        currentChance = 100;
        guaranteedDrop = { ...drop, activeChance: 100 };
      } else {
        currentChance = drop.chance * (1 + 2 * (userMeter.rng_meter_progress / maxScore));
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
    const itemRoll = rng(rollCeiling);

    let cumulativeChance = 0;

    for (const drop of drops) {
      cumulativeChance += drop.activeChance;

      if (itemRoll <= cumulativeChance) {
        wonReward = drop;
        break;
      }
    }
  }

  // sometimes the combined chance of the server drops dosen't reach 100% double unlucky :(
  if (!wonReward) return;

  let isMeterDrop = false;

  if (userMeter.rng_meter_selection === wonReward.id) {
    await client.database.query("UPDATE users SET rng_meter_progress = 0 WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

    isMeterDrop = true;
  }

  // we must first check if the user has found that drop already or if it's new, lets start with getting the drops
  const foundDrops = await dbJsonDataGet(client, message, "found_drops", message.author.id, false);
  if (foundDrops === null) return;

  const currentDate = new Date().toLocaleString();
  const existingItem = foundDrops.findIndex((item) => item.id === wonReward.id);

  if (existingItem !== -1) {
    foundDrops[existingItem].quantity = (foundDrops[existingItem].quantity || 1) + 1;
    foundDrops[existingItem].last_found_date = currentDate;
  } else {
    // to save space, only store the essential data we need to get the item name, desc, odds, etc. that is the id
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

      // i mean, no role exists you won nothing
      if (!role) return;

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
      embed.setDescription(`**${message.author.username}** just found the ***U N K N O W N***!${meterText}`);

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

  if (odds <= 1 && odds > 0.1) {
    embed.setTitle("🌟 RNG DROP! 🌟");
  }

  if (odds < 0.1) {
    embed.setTitle("💫 RNG DROP! 💫");
  }

  embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) }).setTimestamp();

  return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
};
