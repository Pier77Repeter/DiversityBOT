const { EmbedBuilder } = require("discord.js");
const akinator = require("discord.js-akinator");

module.exports = {
  name: "akinator",
  description: "Plays the Akinator game",
  async execute(client, message, args) {
    // this also works when checking if there are or there aren't args
    try {
      if (!args[0]) return await message.reply("Akinator what? Specify a category: **character**, **animal** or **object**");
    } catch (error) {
      return;
    }

    switch (args[0].toLowerCase()) {
      case "character":
        try {
          akinator(message, {
            language: "en",
            childMode: true,
            gameType: "character",
            useButtons: true,
          });
        } catch (error) {
          return;
        }
        break;
      case "animal":
        try {
          akinator(message, {
            language: "en",
            childMode: true,
            gameType: "animal",
            useButtons: true,
          });
        } catch (error) {
          return;
        }
        break;
      case "object":
        try {
          akinator(message, {
            language: "en",
            childMode: true,
            gameType: "object",
            useButtons: true,
          });
        } catch (error) {
          return;
        }
        break;

      default:
        const embed = new EmbedBuilder()
          .setColor(0x33ccff)
          .setTitle("🎮 Akinator game menu")
          .setDescription("Pick the category you would like to choose: **character**, **animal** or **object**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }
    }
  },
};
