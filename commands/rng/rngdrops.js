const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");
const configChecker = require("../../utils/configChecker.js");
const embedPaginator = require("../../utils/embedPaginator.js");

module.exports = {
  name: "rngdrops",
  aliases: ["drops", "sdrops", "serverdrops"],
  description: "Shows all the configured server drops",
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

    const row = await client.database.query("SELECT server_drops, rng_drop_chance FROM servers WHERE server_id = $1", [message.guildId]);

    if (row.rowCount === 0) {
      embed.setColor(0xff0000).setTitle("❌ Nothing so see").setDescription("This server does not have any drops, add one with **d!dropadd**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    const serverDrops = row.rows[0].server_drops;

    embed.setColor(0x1fa7b1).setTitle(`📦 ${message.guild.name}'s drops`);

    if (serverDrops.length === 0) {
      embed.setDescription("No drops to display here, add one with **d!dropadd**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    let odds,
      rarity,
      counter = 0;

    const embeds = [];
    const fields = [];
    const color = 0x1fa7b1;
    const title = `📦 ${message.guild.name}'s drops`;

    for (const drop of serverDrops) {
      odds = Number(drop.chance);

      if (odds > 20) {
        rarity = "Common";
      }

      if (odds <= 20 && odds > 10) {
        rarity = "Uncommon";
      }

      if (odds <= 10 && odds > 3) {
        rarity = "Rare";
      }

      if (odds <= 3 && odds > 1) {
        rarity = "Extraordinary";
      }

      if (odds <= 1 && odds > 0.1) {
        rarity = "Ask John RNG";
      }

      if (odds < 0.1) {
        rarity = "Pray RNGesus";
      }

      fields.push(
        { name: `${drop.name} (${drop.id})`, value: `*${drop.desc}*` },
        { name: "Odds", value: `**${rarity}** (${drop.chance}%)`, inline: true },
        { name: "Type", value: `${drop.type}`, inline: true },
      );

      counter++;

      // we only store 4 fields per embed to prevent reaching 1024 char limit
      if (counter === 4) {
        embeds.push(
          new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .addFields(fields)
            .setFooter({ text: `Global drop chance is ${row.rows[0].rng_drop_chance}%` }),
        );
        fields.splice(0, fields.length);
        counter = 0;
      }
    }

    // dont want duplicates
    if (counter !== 0) {
      embeds.push(
        new EmbedBuilder()
          .setColor(color)
          .setTitle(title)
          .addFields(fields)
          .setFooter({ text: `Global drop chance is ${row.rows[0].rng_drop_chance}%` }),
      );
    }

    try {
      return await embedPaginator(this.name, message, embeds);
    } catch (error) {
      return msgErrorHandler(error);
    }
  },
};
