const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");
const configChecker = require("../../utils/configChecker.js");
const embedPaginator = require("../../utils/embedPaginator.js");
const rngRarityLabel = require("../../utils/rngRarityLabel.js");

module.exports = {
  name: "rngmydrops",
  aliases: ["mydrops", "mydps", "founddrops", "rngfd"],
  description: "Shows all the drops an user has found, supports mentioned members too",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isRngEnabled = await configChecker(client, message, "rng_cmd");
    if (isRngEnabled === null) return;

    if (!isRngEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("RNG commands are off! Type **d!setup rng** to enable them");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await client.database.query("SELECT u.found_drops, s.server_drops FROM users u, servers s WHERE u.server_id = $1 AND u.user_id = $2", [message.guildId, user.id]);

    if (row.rowCount === 0) {
      embed.setColor(0xff0000).setTitle("❌ Nothing To See").setDescription("This user never used even one of my commands >:(");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const serverDrops = row.rows[0].server_drops;
    const userFoundDrops = row.rows[0].found_drops;

    embed.setColor(0x1fa7b1).setTitle(`🔍 ${user.username}'s Found Drops`);

    if (userFoundDrops.length === 0) {
      embed.setDescription("No drops to display here, haven't found nothing *YET*");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    const embeds = [];
    const fields = [];
    const color = 0x1fa7b1;
    const title = `🔍 ${user.username}'s Found Drops`;

    let odds,
      dropId,
      counter = 0;

    for (const drop of userFoundDrops) {
      dropId = Number(drop.id - 1);
      odds = Number(serverDrops[dropId].chance);

      fields.push(
        { name: `${serverDrops[dropId].name} (x${drop.quantity})`, value: `> *${serverDrops[dropId].desc}*` },
        { name: "Odds", value: `**${rngRarityLabel(odds)}** (${serverDrops[dropId].chance}%)`, inline: true },
        { name: "Dates", value: `First found: \`${drop.first_found_date}\`\nLast found: \`${drop.last_found_date}\``, inline: true },
      );

      counter++;

      // we only store 4 fields per embed to prevent reaching 1024 char limit
      if (counter === 4) {
        embeds.push(
          new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .addFields(fields)
            .setFooter({ text: user.username, iconURL: user.avatarURL({ dynamic: true }) }),
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
          .setFooter({ text: user.username, iconURL: user.avatarURL({ dynamic: true }) }),
      );
    }

    return await embedPaginator(this.name, message, embeds).catch(msgErrorHandler);
  },
};
