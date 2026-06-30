const { EmbedBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const listsGetRandomItem = require("../../utils/listsGetRandomItem");

module.exports = {
  name: "timezone",
  aliases: ["tz"],
  description: "Convert local timezone to another",
  async execute(client, message, args) {
    // IANA timezones for reference
    const timezones = [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/Anchorage",
      "Pacific/Honolulu",
      "America/Sao_Paulo",
      "America/Argentina/Buenos_Aires",
      "UTC",
      "Europe/London",
      "Europe/Paris",
      "Europe/Athens",
      "Europe/Moscow",
      "Africa/Johannesburg",
      "Asia/Dubai",
      "Asia/Kolkata",
      "Asia/Bangkok",
      "Asia/Shanghai",
      "Asia/Singapore",
      "Asia/Tokyo",
      "Asia/Seoul",
      "Australia/Perth",
      "Australia/Sydney",
      "Pacific/Auckland",
    ];

    // d!timezone [from] [hour] [to]
    const fromZone = args[0];
    const timeStr = args[1];
    const toZone = args[2];

    const embed = new EmbedBuilder().setColor("DarkRed").setTitle("❌ Error");

    if (!fromZone || !timeStr || !toZone) {
      embed
        .setDescription("Missing arguments!\nUsage: `d!timezone <from_timezone> <hour> <to_timezone>`\nExample: `d!timezone America/New_York 19:40 Europe/London`")
        .setFooter({ text: "Timezones must use valid IANA names" });

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const todayInFromZone = DateTime.now().setZone(fromZone).toISODate();
    const dt = DateTime.fromISO(`${todayInFromZone}T${timeStr}`, {
      zone: fromZone,
    });

    if (!dt.isValid) {
      embed.setDescription("Invalid hour formatting, use the 24 hour system, examples `13:33`, `9:10`, `22:40`").setFooter(null);

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const converted = dt.setZone(toZone);
    embed.setDescription("Invalid target timezone: `" + toZone + "`. Please use a valid IANA format like `Europe/Paris` or `UTC`.").setFooter(null);

    if (!converted.isValid) {
      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const emojis = ["🕐", "🕙", "🕥", "🕚", "🕦", "🕛", "🕧", "🕜", "🕑", "🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕕", "🕡", "🕖", "🕢", "🕗", "🕣", "🕘", "🕤"];

    embed
      .setColor("Blurple")
      .setTitle(listsGetRandomItem(emojis) + " " + fromZone + " " + timeStr + " ➡️ " + toZone + " " + converted.toFormat("dd-LL HH:mm"))
      .setDescription(null)
      .setFooter(null);

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
