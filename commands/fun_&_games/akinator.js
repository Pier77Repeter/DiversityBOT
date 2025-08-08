const akinator = require("discord.js-akinator");

module.exports = {
  name: "akinator",
  description: "Plays the Akinator game",
  async execute(client, message, args) {
    // bruh, akinator isn't working rn, those devs must fix their npm package
    try {
      return await message.reply("I'm sorry but at the moment this command isn't working, it will be re-enable asap");
    } catch (error) {
      return;
    }

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
        try {
          return await message.reply("What? These are the only available options: **character**, **animal** or **object**");
        } catch (error) {
          return;
        }
    }
  },
};
