const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");
const configChecker = require("../../utils/configChecker.js");
const embedPaginator = require("../../utils/embedPaginator.js");

module.exports = {
  name: "mydrops",
  aliases: ["mydps", "founddrops"],
  description: "Shows all the drops an user has found, supports mentioned members too",
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

    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await client.database.query("SELECT u.found_drops, s.server_drops FROM users u, servers s WHERE u.server_id = $1 AND u.user_id = $2", [message.guildId, user.id]);

    if (row.rowCount === 0) {
      embed.setColor(0xff0000).setTitle("❌ Nothing so see").setDescription("This user never used even one of my commands >:(");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    const serverDrops = row.rows[0].server_drops;
    const userFoundDrops = row.rows[0].found_drops;

    embed.setColor(0x1fa7b1).setTitle(`🔍 ${user.username}'s found drops`);

    if (userFoundDrops.length === 0) {
      embed.setDescription("No drops to display here, haven't found nothing *YET*");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    let odds,
      rarity,
      dropId,
      counter = 0;

    const embeds = [];
    const fields = [];
    const color = 0x1fa7b1;
    const title = `🔍 ${user.username}'s found drops`;

    for (const drop of userFoundDrops) {
      dropId = Number(drop.id - 1);
      odds = Number(serverDrops[dropId].chance);

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
        { name: `${serverDrops[dropId].name} (x${drop.quantity})`, value: `*${serverDrops[dropId].desc}*` },
        { name: "Odds", value: `**${rarity}** (${serverDrops[dropId].chance}%)`, inline: true },
        { name: "Dates", value: `First found: \`${drop.first_found_date}\`\nLast found: \`${drop.last_found_date}\``, inline: true },
      );

      counter++;

      // we only store 4 fields per embed to prevent reaching 1024 char limit
      if (counter === 4) {
        embeds.push(new EmbedBuilder().setColor(color).setTitle(title).addFields(fields));
        fields.splice(0, fields.length);
        counter = 0;
      }
    }

    // dont want duplicates
    if (counter !== 0) {
      embeds.push(new EmbedBuilder().setColor(color).setTitle(title).addFields(fields));
    }

    try {
      return await embedPaginator(this.name, message, embeds);
    } catch (error) {
      return msgErrorHandler(error);
    }
  },
};
