const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "decoshop",
  description: "See the decoration store",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isEventEnabled = await configChecker(client, message, "eventCmd");
    if (isEventEnabled == null) return;

    if (!isEventEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Event commands are off! Type **d!setup event** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    embed
      .setColor(0x66cccc)
      .setTitle("🏪 The Decoration Shop")
      .setDescription("Customize your Christmas tree with these wonderful decorations!")
      .addFields([
        {
          name: "🌟 Christmas star",
          value: "Item cost: **300 🪙**",
          inline: false,
        },
        {
          name: "🕯️ Candles",
          value: "Item cost: **100 🪙**",
          inline: false,
        },
        {
          name: "🔴 Christmas balls (multi-color)",
          value: "Item cost: **50 🪙**",
          inline: false,
        },
        {
          name: "🟥 Tree decorations (multi-color)",
          value: "Item cost: **50 🪙**",
          inline: false,
        },
      ])
      .setFooter({ text: "Your tree needs to be maxed to buy them" });

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
