const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");
const configChecker = require("../../utils/configChecker.js");
const embedPaginator = require("../../utils/embedPaginator.js");
const rngRarityLabel = require("../../utils/rngRarityLabel.js");

module.exports = {
  name: "rngdrops",
  aliases: ["drops", "sdrops", "serverdrops", "rngsd"],
  description: "Shows all the configured server drops",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isRngEnabled = await configChecker(client, message, "rng_cmd");
    if (isRngEnabled === null) return;

    if (!isRngEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("RNG commands are off! Type **d!setup rng** to enable them");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const row = await client.database.query("SELECT server_drops, rng_drop_chance FROM servers WHERE server_id = $1", [message.guildId]);

    if (row.rowCount === 0) {
      embed.setColor(0xff0000).setTitle("❌ Nothing To See").setDescription("This server does not have any drops, add one with **d!dropadd**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const serverDrops = row.rows[0].server_drops;

    embed.setColor(0x1fa7b1).setTitle(`📦 ${message.guild.name}'s Drops`);

    if (serverDrops.length === 0) {
      embed.setDescription("No drops to display here, add one with **d!dropadd**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    let counter = 0;

    const embeds = [];
    const fields = [];
    const color = 0x1fa7b1;
    const title = `📦 ${message.guild.name}'s Drops`;
    const desc = "List of drops that can be found while chatting in this server, the owner can edit, remove or create new ones";

    for (const drop of serverDrops) {
      fields.push(
        { name: `(ID ${drop.id}) ${drop.name}`, value: `> *${drop.desc}*` },
        { name: "Odds", value: `**${rngRarityLabel(Number(drop.chance))}** (${drop.chance}%)`, inline: true },
        { name: "Type", value: `${drop.type}`, inline: true },
      );

      counter++;

      // we only store 4 fields per embed to prevent reaching 1024 char limit
      if (counter === 4) {
        embeds.push(
          new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(desc)
            .addFields(fields)
            .setFooter({ text: `${message.guild.name} - GDC is ${row.rows[0].rng_drop_chance}%`, iconURL: message.guild.iconURL() }),
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
          .setDescription(desc)
          .addFields(fields)
          .setFooter({ text: `${message.guild.name} - GDC is ${row.rows[0].rng_drop_chance}%`, iconURL: message.guild.iconURL() }),
      );
    }

    return await embedPaginator(this.name, message, embeds).catch(msgErrorHandler);
  },
};
