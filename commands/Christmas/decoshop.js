const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "decoshop",
  description: "See the decoration store",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isEventEnabled = await configChecker(client, message, "event_cmd");
    if (isEventEnabled === null) return;

    if (!isEventEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Event commands are off! Type **d!setup event** to enable them");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    embed
      .setColor(0x66cccc)
      .setTitle("🏪 The Decoration Shop")
      .setDescription("Customize your Christmas tree with these wonderful decorations!")
      .addFields([
        {
          name: "🌟 Christmas Star",
          value: "Item cost: **300 🪙**",
          inline: false,
        },
        {
          name: "🕯️ Candles",
          value: "Item cost: **100 🪙**",
          inline: false,
        },
        {
          name: "🔴 Christmas Balls (multi-color)",
          value: "Item cost: **50 🪙**",
          inline: false,
        },
        {
          name: "🟥 Tree Decorations (multi-color)",
          value: "Item cost: **50 🪙**",
          inline: false,
        },
      ])
      .setFooter({ text: "Decorations can only be applied to maxed trees!" });

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
