const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "materials",
  description: "Check the materials the user has collected",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isEventEnabled = await configChecker(client, message, "event_cmd");
    if (isEventEnabled === null) return;

    if (!isEventEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Event commands are off! Type **d!setup event** to enable them");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const res = await client.database.query("SELECT twigs, leaves, golden_coins, deco_id1, deco_id2, deco_id3, deco_id4 FROM events WHERE server_id = $1 AND user_id = $2", [
      message.guildId,
      user.id,
    ]);
    const row = res.rows[0];

    // hmmmmmmmmmmmmmmmmm, better than row.rowCount?
    if (!row) {
      embed.setColor(0xff0000).setTitle("😥 Very Sad").setDescription("It seems like the user dosen't know i exist and won't get the materials for his tree");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    embed
      .setColor(0x33ccff)
      .setTitle(`🛠️ ${user.username}'s Materials`)
      .setDescription("You have collected nothing! You should start chopping down some trees and help Santa Claus!");

    if (row.golden_coins > 0 || row.twigs > 0 || row.leaves > 0 || row.deco_id1 || row.deco_id2 || row.deco_id3 || row.deco_id4) {
      embed.setDescription(`🪙 Golden coins: **${row.golden_coins}**\n🪵 Twigs: **${row.twigs}**\n🌿 Leaves: **${row.leaves}**`);
    }

    if (!row.deco_id1 && !row.deco_id2 && !row.deco_id3 && !row.deco_id4) {
      embed.addFields({ name: "Owned Decorations", value: "You don't own any decorations yet, you can buy them in the shop" });

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return; // why continue?
    }

    if (row.deco_id1) {
      embed.addFields({ name: "🌟 Christmas Star", value: "Best decoration out there!" });
    }

    if (row.deco_id2) {
      embed.addFields({ name: "🕯️ Candles", value: "Old fashion lights for your tree!" });
    }

    if (row.deco_id3) {
      embed.addFields({ name: "🔴 Christmas Balls (multi-color)", value: "Classic decorations (Don't get the name wrong)" });
    }

    if (row.deco_id4) {
      embed.addFields({ name: "🟥 Tree Decorations (multi-color)", value: "Classic decoration to make your tree look better" });
    }

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
