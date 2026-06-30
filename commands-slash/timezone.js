const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const listsGetRandomItem = require("../utils/listsGetRandomItem");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timezone")
    .setDescription("Convert a timezone to another one!")
    .addStringOption((option) =>
      // this is useful usage of ai again
      option.setName("timezone").setDescription("Your nearest timezone").setRequired(true).addChoices(
        // Americas
        { name: "US Eastern Time (ET) - New York", value: "America/New_York" },
        { name: "US Central Time (CT) - Chicago", value: "America/Chicago" },
        { name: "US Mountain Time (MT) - Denver", value: "America/Denver" },
        { name: "US Pacific Time (PT) - Los Angeles", value: "America/Los_Angeles" },
        { name: "US Alaska Time (AKT) - Anchorage", value: "America/Anchorage" },
        { name: "US Hawaii Time (HST) - Honolulu", value: "Pacific/Honolulu" },
        { name: "Brazil Time (BRT) - São Paulo", value: "America/Sao_Paulo" },
        { name: "Argentina Time (ART) - Buenos Aires", value: "America/Argentina/Buenos_Aires" },

        // Europe & Africa
        { name: "Coordinated Universal Time (UTC / GMT)", value: "UTC" },
        { name: "Western European Time (WET) - London", value: "Europe/London" },
        { name: "Central European Time (CET) - Paris/Rome", value: "Europe/Paris" },
        { name: "Eastern European Time (EET) - Cairo/Athens", value: "Europe/Athens" },
        { name: "Moscow Time (MSK) - Moscow", value: "Europe/Moscow" },
        { name: "South Africa Standard Time (SAST)", value: "Africa/Johannesburg" },

        // Asia & Middle East
        { name: "Gulf Standard Time (GST) - Dubai", value: "Asia/Dubai" },
        { name: "India Standard Time (IST) - Kolkata", value: "Asia/Kolkata" },
        { name: "Indochina Time (ICT) - Bangkok", value: "Asia/Bangkok" },
        { name: "China Standard Time (CST) - Beijing", value: "Asia/Shanghai" },
        { name: "Singapore Standard Time (SGT)", value: "Asia/Singapore" },
        { name: "Japan Standard Time (JST) - Tokyo", value: "Asia/Tokyo" },
        { name: "Korea Standard Time (KST) - Seoul", value: "Asia/Seoul" },

        // Oceania
        { name: "Australian Western Time (AWST) - Perth", value: "Australia/Perth" },
        { name: "Australian Eastern Time (AEST) - Sydney", value: "Australia/Sydney" },
        { name: "New Zealand Time (NZDT) - Auckland", value: "Pacific/Auckland" },
      ),
    )
    .addStringOption((option) => option.setName("hour").setDescription("The hour to be converted (ex 19:40)").setRequired(true))
    .addStringOption((option) =>
      option.setName("convert").setDescription("The timezone for convertion").setRequired(true).addChoices(
        // Americas
        { name: "US Eastern Time (ET) - New York", value: "America/New_York" },
        { name: "US Central Time (CT) - Chicago", value: "America/Chicago" },
        { name: "US Mountain Time (MT) - Denver", value: "America/Denver" },
        { name: "US Pacific Time (PT) - Los Angeles", value: "America/Los_Angeles" },
        { name: "US Alaska Time (AKT) - Anchorage", value: "America/Anchorage" },
        { name: "US Hawaii Time (HST) - Honolulu", value: "Pacific/Honolulu" },
        { name: "Brazil Time (BRT) - São Paulo", value: "America/Sao_Paulo" },
        { name: "Argentina Time (ART) - Buenos Aires", value: "America/Argentina/Buenos_Aires" },

        // Europe & Africa
        { name: "Coordinated Universal Time (UTC / GMT)", value: "UTC" },
        { name: "Western European Time (WET) - London", value: "Europe/London" },
        { name: "Central European Time (CET) - Paris/Rome", value: "Europe/Paris" },
        { name: "Eastern European Time (EET) - Cairo/Athens", value: "Europe/Athens" },
        { name: "Moscow Time (MSK) - Moscow", value: "Europe/Moscow" },
        { name: "South Africa Standard Time (SAST)", value: "Africa/Johannesburg" },

        // Asia & Middle East
        { name: "Gulf Standard Time (GST) - Dubai", value: "Asia/Dubai" },
        { name: "India Standard Time (IST) - Kolkata", value: "Asia/Kolkata" },
        { name: "Indochina Time (ICT) - Bangkok", value: "Asia/Bangkok" },
        { name: "China Standard Time (CST) - Beijing", value: "Asia/Shanghai" },
        { name: "Singapore Standard Time (SGT)", value: "Asia/Singapore" },
        { name: "Japan Standard Time (JST) - Tokyo", value: "Asia/Tokyo" },
        { name: "Korea Standard Time (KST) - Seoul", value: "Asia/Seoul" },

        // Oceania
        { name: "Australian Western Time (AWST) - Perth", value: "Australia/Perth" },
        { name: "Australian Eastern Time (AEST) - Sydney", value: "Australia/Sydney" },
        { name: "New Zealand Time (NZDT) - Auckland", value: "Pacific/Auckland" },
      ),
    ),

  async execute(client, interaction) {
    const { options } = interaction;
    const fromZone = options.getString("timezone");
    const timeStr = options.getString("hour");
    const toZone = options.getString("convert");

    // convert data from today
    const todayInFromZone = DateTime.now().setZone(fromZone).toISODate();

    const dt = DateTime.fromISO(`${todayInFromZone}T${timeStr}`, {
      zone: fromZone,
    });

    if (!dt.isValid) {
      try {
        return await interaction.reply("Invalid hour formatting, use the 24 hour system, examples `13:33`, `9:10`, `22:40`");
      } catch {
        return;
      }
    }

    const converted = dt.setZone(toZone);

    const emojis = ["🕐", "🕙", "🕥", "🕚", "🕦", "🕛", "🕧", "🕜", "🕑", "🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕕", "🕡", "🕖", "🕢", "🕗", "🕣", "🕘", "🕤"];

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(listsGetRandomItem(emojis) + " " + fromZone + " " + timeStr + " ➡️ " + toZone + " " + converted.toFormat("dd-LL HH:mm"));

    try {
      return await interaction.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
