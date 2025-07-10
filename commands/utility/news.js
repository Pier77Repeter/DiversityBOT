const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "news",
  description: "See the news",
  async execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor(0x339999)
      .setTitle("📜 Changelogs/news")
      .setDescription(
        [
          "**Big Release 2.0!**",
          "",
          "The bot has been completly re-designed from 0",
          "Added tons of new commands and slash commands",
          "Added back the music system",
          "Added the ability to log mod cmds actions",
          "General performance improvements in all actions",
          "Balanced economy commands and cooldowns",
          "Improved cmds descriptions in d!help and /help",
          "Changed and improved the look of some commands",
          "Changed how to bot handle errors, much better",
          "Changed database to a more professional one",
          "Changed commands replying with multiple msgs",
          "Fixed those random data corruption in db",
          "Fixed bot not responding on error",
          "Fixed d!meme, you can now browse multiple subs",
          "Fixed a few commands not working at all",
          "Fixed moderation commands not fully working",
        ].join("\n")
      )
      .addFields({
        name: "More info, suggestions and bug report here:",
        value: "https://discord.gg/KxadTdz",
        inline: false,
      });

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
