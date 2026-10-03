const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");
const configChecker = require("../../utils/configChecker.js");
const rngRarityColor = require("../../utils/rngRarityColor.js");
const rngRarityLabel = require("../../utils/rngRarityLabel.js");

module.exports = {
  name: "rngc",
  aliases: ["rngcalc", "rngcalculator"],
  description: "Given the item name or id, shows all the nerd probabilities",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isRngEnabled = await configChecker(client, message, "rng_cmd");
    if (isRngEnabled === null) return;

    if (!isRngEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("RNG commands are off! Type **d!setup rng** to enable them");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const dropIdOrName = String(args.join(" ")).toLowerCase();
    if (!dropIdOrName) {
      return await message.reply("Can you specify which drop you want me to show you?").catch(msgErrorHandler);
    }

    const row = await client.database.query("SELECT s.rng_drop_chance, s.server_drops, u.rng_meter_selection FROM servers s, users u WHERE s.server_id = $1 AND u.user_id = $2", [
      message.guildId,
      message.author.id,
    ]);

    if (row.rowCount === 0) {
      embed.setColor(0xff0000).setTitle("❌ Nothing").setDescription("No drops have been created, setup one with **d!dropadd**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const selRngMeter = row.rows[0].rng_meter_selection;
    const serverDrops = row.rows[0].server_drops;
    const globalDropChance = row.rows[0].rng_drop_chance;

    // if we find something this embed will be modified else will remain the same
    embed.setColor(0xff0000).setTitle("❌ Not found").setDescription(`No drop with id or name **${dropIdOrName}** has been found, check server drops with **d!rngdrops**`);

    let odds;

    for (const drop of serverDrops) {
      if (drop.name.toLowerCase() === dropIdOrName || drop.id === dropIdOrName) {
        embed.setTitle(`🧮 Item Overview (ID ${drop.id})`).setDescription(`**${drop.name}**\n> *${drop.desc}*\n`);

        // REMEMBER TO PARSE TO NUMBER
        odds = Number(drop.chance);

        embed.setColor(rngRarityColor(odds)).addFields({ name: "Odds", value: `**${rngRarityLabel(odds)}** (${odds}%)`, inline: true });

        const perMsgChance = Number((globalDropChance / 100) * odds);
        const numOfMsgs = perMsgChance === 100 ? 1 : 1 / (perMsgChance / 100);

        embed
          .addFields({ name: "Per-Message Odds", value: `${perMsgChance.toFixed(7).toString()}%`, inline: true })
          .setFooter({ text: `1/${Math.round(numOfMsgs)} from messages with a global drop of ${globalDropChance}%` });

        // last but not least rng meter
        if (selRngMeter === drop.id) embed.addFields({ name: "🟢 SELECTED", value: "" });

        break;
      }
    }

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
