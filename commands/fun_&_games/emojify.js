const { Emojify } = require("discord-gamecord");

module.exports = {
  name: "emojify",
  description: "Convert your text into emojis",
  async execute(client, message, args) {
    // this is yet another way to check if there are args or not
    try {
      if (args.lenght == 0) return await message.reply("Provide ***t e x t*** to convert into emojis");
    } catch (error) {
      return;
    }

    if (args.lenght > 1024) {
      try {
        return await message.reply("Text is too looooooooooong, max 1024 chars!");
      } catch (error) {
        return;
      }
    }

    try {
      return await message.reply(await Emojify(args.join(" ")));
    } catch (error) {
      try {
        return await message.reply("Text is too long, make it shorter so that i can send it");
      } catch (error) {
        return;
      }
    }
  },
};
