const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");
const configChecker = require("../../utils/configChecker.js");

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

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    const dropIdOrName = String(args.join(" ")).toLowerCase();

    if (!dropIdOrName) {
      try {
        return await message.reply("Can you specify which drop you want me to show you?");
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    const row = await client.database.query("SELECT rng_drop_chance, server_drops FROM servers WHERE server_id = $1", [message.guildId]);

    if (row.rowCount === 0) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("No drops have been created, setup one with **d!dropadd**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    const serverDrops = row.rows[0].server_drops;
    const globalDropChance = row.rows[0].rng_drop_chance;

    // if we find something this embed will be modified else will remain the same
    embed.setColor(0xff0000).setTitle("❌ Not found").setDescription(`No drop with id or name **${dropIdOrName}** has been found, check server drops with **d!rngdrops**`);

    let odds;

    for (const drop of serverDrops) {
      if (drop.name.toLowerCase() === dropIdOrName || drop.id === dropIdOrName) {
        embed.setTitle(`📔 Item Overview (${drop.id})`).setDescription(`**${drop.name}**\n\n*${drop.desc}*\n`);

        // REMEMBER TO PARSE TO NUMBER
        odds = Number(drop.chance);

        if (odds > 20) {
          embed.setColor(0x2ecc71).addFields({ name: "Odds", value: `**Common** (${odds}%)`, inline: true });
        }

        if (odds <= 20 && odds > 10) {
          embed.setColor(0x459bff).addFields({ name: "Odds", value: `**Uncommon** (${odds}%)`, inline: true });
        }

        if (odds <= 10 && odds > 3) {
          embed.setColor(0x55ffff).addFields({ name: "Odds", value: `**Rare** (${odds}%)`, inline: true });
        }

        if (odds <= 3 && odds > 1) {
          embed.setColor(0xa335ee).addFields({ name: "Odds", value: `**Extraordinary** (${odds}%)`, inline: true });
        }

        if (odds <= 1 && odds > 0.1) {
          embed.setColor(0xff55ff).addFields({ name: "Odds", value: `**Ask John RNG** (${odds}%)`, inline: true });
        }

        if (odds < 0.1) {
          embed.setColor(0xff5555).addFields({ name: "Odds", value: `**Pray RNGesus** (${odds}%)`, inline: true });
        }

        const perMsgChance = Number((globalDropChance / 100) * odds);
        const numOfMsgs = perMsgChance === 100 ? 1 : Number(Math.ceil(Math.log(1 - 99.99999 / 100) / Math.log(1 - perMsgChance / 100)));

        // this fixed the issue of having results like "5e-8%" or "12.34000000%"
        const formatPercent = (n) => {
          const s = Number(n)
            .toFixed(8)
            .replace(/\.?0+$/, "");
          return s;
        };

        embed
          .addFields({ name: "Per-Message Odds", value: `${formatPercent(perMsgChance)}%`, inline: true })
          .setFooter({ text: `1/${numOfMsgs} from messages with a global drop of ${globalDropChance}%` });

        break;
      }
    }

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return msgErrorHandler(error);
    }
  },
};
