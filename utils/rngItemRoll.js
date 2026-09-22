const { EmbedBuilder } = require("discord.js");
const rng = require("./rng");

module.exports = async function rngItemRoll(message, serverDrops, globalDropRate) {
  // RNG 1: Does a drop event trigger?
  const eventRoll = rng();
  if (eventRoll > globalDropRate) return; // The 5% check failed, no drop.

  // RNG 2: The event triggered! What drops from the pool?
  const itemRoll = rng();
  let cumulativeChance = 0;
  let wonReward = null;

  // Evaluate the pool exactly as the owner defined it
  for (const drop of serverDrops) {
    cumulativeChance += drop.chance;

    if (itemRoll <= cumulativeChance) {
      wonReward = drop;
      break;
    }
  }

  // If itemRoll lands in the empty space (e.g., rolls 50 but pool total is 33),
  // wonReward remains null and the user gets nothing despite the event triggering.
  if (!wonReward) return;

  const odds = wonReward.chance;
  const embed = new EmbedBuilder();

  // Process the reward
  if (wonReward.type === "item") {
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

    embed
      .setDescription(`**${message.author.username}** just found a **${wonReward.name}**!\n\n*${wonReward.desc}*`)
      .setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) })
      .setTimestamp();

    try {
      await message.reply({ embeds: [embed] });
    } catch (error) {
      msgErrorHandler(error);
    }
  }
};
