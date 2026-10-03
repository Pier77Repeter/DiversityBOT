const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");
const configChecker = require("../../utils/configChecker.js");
const rngRarityLabel = require("../../utils/rngRarityLabel.js");
const rngRarityColor = require("../../utils/rngRarityColor.js");

// i just discovered that helper functions should be put here O_O
// this fixes the issue of having results like "5e-8%" or "12.34000000%" it also adjust the lenght of the number based on increased chance
function rngFormatPercent(chanceToFormat, baseChance, maxScore) {
  const incrementPerXp = (baseChance * 2) / maxScore;

  // get the order of magnitude of the increment, example an increment of 0.00001 has a log10 of -5 and we need 5 decimal places to display it
  const magnitude = incrementPerXp > 0 ? Math.abs(Math.floor(Math.log10(incrementPerXp))) : 4;

  // minimum 4 decimal places and cap at 15 to prevent JS infinity errors
  const precision = Math.min(15, Math.max(4, magnitude));

  // toFixed() strips the floating-point noise and Number() removes trailing zeros
  return Number(chanceToFormat.toFixed(precision));
}

function formatXp(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "b"; // one. billion. messages.
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "m";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
  return num.toLocaleString();
}

function createProgressBar(current, max, size = 16) {
  const percentage = Math.min(1, current / max);
  const progressBlocks = Math.round(size * percentage);
  const emptyBlocks = size - progressBlocks;

  return "▰".repeat(progressBlocks) + "▱".repeat(emptyBlocks);
}

module.exports = {
  name: "rngmeter",
  aliases: ["meter", "rngm"],
  description: "Check an user rng meter progress for x item",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isRngEnabled = await configChecker(client, message, "rng_cmd");
    if (isRngEnabled === null) return;

    if (!isRngEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("RNG commands are off! Type **d!setup rng** to enable them");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await client.database.query(
      "SELECT u.rng_meter_selection, u.rng_meter_progress, s.server_drops, s.rng_drop_chance FROM users u, servers s WHERE s.server_id = $1 AND u.user_id = $2",
      [message.guildId, user.id],
    );

    if (row.rowCount === 0) {
      embed.setColor(0xff0000).setTitle("❌ Nothing To See").setDescription("This user's RNG Meter is empty because he did not use even 1 of my commands");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const userMeterSelected = row.rows[0].rng_meter_selection;
    const userMeterProgress = row.rows[0].rng_meter_progress;
    const serverDrops = row.rows[0].server_drops;
    const globalDropRate = row.rows[0].rng_drop_chance;

    if (!userMeterSelected) {
      embed.setColor(0xff0000).setTitle("❌ Empty RNG Meter").setDescription("You have no item selected on your RNG Meter! Select with **d!rngselect <itemId>**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const targetItem = serverDrops.find((drop) => drop.id === userMeterSelected);

    if (!targetItem) {
      embed.setColor(0xff0000).setTitle("❌ Not found").setDescription("The selected item was not found in the server drops");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    // formula for the item score is "1 / (itemChance / 100)"
    const effectiveChance = (globalDropRate / 100) * (targetItem.chance / 100);
    const maxScore = effectiveChance < 1 ? Math.ceil(1 / effectiveChance) : 1;

    // alllllll the data in the embed message
    const boostedChance = userMeterProgress >= maxScore ? 100 : targetItem.chance * (1 + 2 * (userMeterProgress / maxScore));
    const progressPercent = Math.min(100, (userMeterProgress / maxScore) * 100);

    const boostedChanceFormatted = rngFormatPercent(Number(boostedChance), targetItem.chance, maxScore);
    const currentXp = Math.floor(userMeterProgress).toLocaleString();

    // huge description
    const description = [
      `Odds: **${rngRarityLabel(targetItem.chance)}** (~~${targetItem.chance}%~~ **${boostedChanceFormatted}%**)`,
      ``,
      `Progress: **${progressPercent.toFixed(1)}%**`,
      `${createProgressBar(userMeterProgress, maxScore)} **${currentXp}**/**${formatXp(maxScore)}**`,
      ``,
      `Filling the meter increases the drop chance of this item. Reaching **100%** will guarantee it to drop!`,
      ``,
    ].join("\n");

    embed
      .setColor(rngRarityColor(targetItem.chance))
      .setTitle(`🎯 RNG Meter - **${targetItem.name}** (ID ${targetItem.id})`)
      .setDescription(description)
      .setFooter({ text: user.username, iconURL: user.avatarURL({ dynamic: true }) });

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
