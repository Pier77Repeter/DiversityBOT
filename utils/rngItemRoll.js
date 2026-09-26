const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const rng = require("./rng");
const dbJsonDataGet = require("./dbJsonDataGet");
const dbJsonDataSet = require("./dbJsonDataSet");
const manageUserMoney = require("./manageUserMoney");

// this is needed to roll the items every time i message is sent
// it works by doing 2 rolls, 1 for dropping an item, 2 for dropping X item
module.exports = async function rngItemRoll(client, message, serverDrops, globalDropRate) {
  const eventRoll = rng();
  if (eventRoll > globalDropRate) return; // no items dropped this message :(

  // AN ITEM HAS BEEN FOUND! TIME TO PRAY JOHN RNG
  const itemRoll = rng();
  let cumulativeChance = 0;
  let wonReward = null;

  for (const drop of serverDrops) {
    cumulativeChance += drop.chance;

    if (itemRoll <= cumulativeChance) {
      wonReward = drop;
      break;
    }
  }

  // sometimes the combined chance of the server drops dosen't reach 100% do you may get double unlucky
  if (!wonReward) return;

  // we must first check if the user has found that drop already or if it's new, lets start with getting the drops
  const drops = await dbJsonDataGet(client, message.author, message, "found_drops");
  if (drops === null) return;

  const currentDate = new Date().toLocaleString();

  // check if the user already owns this item
  const existingItem = drops.findIndex((item) => item.id === wonReward.id);

  if (existingItem !== -1) {
    drops[existingItem].quantity = (drops[existingItem].quantity || 1) + 1;
    drops[existingItem].last_found_date = currentDate;
  } else {
    // to save space, only store the essential data we need to get the item name, desc, odds, etc. that is the id
    drops.push({
      id: wonReward.id,
      quantity: 1,
      first_found_date: currentDate,
      last_found_date: currentDate,
    });
  }

  // well we are just saving every found drops
  if ((await dbJsonDataSet(client, message, "found_drops", JSON.stringify(drops))) === null) return;

  const odds = wonReward.chance;
  const embed = new EmbedBuilder();

  // owners can setup different rewards types: role, item, money and maybe more stuff i dont know
  switch (wonReward.type) {
    case "item":
      embed.setDescription(`**${message.author.username}** just found a **${wonReward.name}**!\n\n*${wonReward.desc}*`);

      break;

    case "money":
      embed.setDescription(`**${message.author.username}** just found a **${wonReward.name}** and got **${wonReward.money}$**!\n\n*${wonReward.desc}*`);

      if ((await manageUserMoney(client, message, "+", wonReward.money)) === null) return;

      break;

    case "role":
      const role = message.guild.roles.cache.get(wonReward.role_id);

      // i mean, no role exists you won nothing
      if (!role) return;

      embed.setDescription(`**${message.author.username}** just found the role <@&${role.id}>!\n\n*${wonReward.desc}*`);

      if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageRoles)) {
        embed.addFields({ name: "F!", value: "I'm missing `Manage Roles` permission to give you the role, ask a server mod" });
        break;
      }

      await message.member.roles.add(role).catch(() => {
        embed.addFields({ name: "Whopsy!", value: "I couldn't add you the role automatically, ask a server mod" });
      });

      // wasn't sure if it was better to stay silent or announce you found it twice, well better say something since we have 'quantity' attribute now
      if (message.member.roles.cache.has(role.id)) {
        embed.setDescription(`**${message.author.username}** just found again the role <@&${role.id}>!\n\n*${wonReward.desc}*`);
      }

      break;

    // shouldn't happen?
    default:
      embed.setDescription(`**${message.author.username}** just found the ***U N K N O W N***!`);
      break;
  }

  // looks cool to make the embed dynamic to the drop's chance
  if (odds > 20) {
    embed.setColor(0x2ecc71).setTitle("🍀 RNG DROP! 🍀");
  }

  if (odds <= 20 && odds > 10) {
    embed.setColor(0x459bff).setTitle("🔥 RNG DROP! 🔥");
  }

  if (odds <= 10 && odds > 3) {
    embed.setColor(0x55ffff).setTitle("✨ RNG DROP! ✨");
  }

  if (odds <= 3 && odds > 1) {
    embed.setColor(0xa335ee).setTitle("⭐ RNG DROP! ⭐");
  }

  if (odds <= 1 && odds > 0.1) {
    embed.setColor(0xff55ff).setTitle("🌟 RNG DROP! 🌟");
  }

  if (odds < 0.1) {
    embed.setColor(0xff5555).setTitle("💫 RNG DROP! 💫");
  }

  embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) }).setTimestamp();

  try {
    return await message.reply({ embeds: [embed] });
  } catch (error) {
    return msgErrorHandler(error);
  }
};
