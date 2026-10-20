const { Emojify } = require("discord-gamecord");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "emojify",
  description: "Convert your text into emojis",
  async execute(client, message, args) {
    // this is yet another way to check if there are args or not
    if (args.lenght == 0) return await message.reply("Provide ***t e x t*** to convert into emojis").catch(msgErrorHandler);
    if (args.lenght > 1024) return await message.reply("Text is too looooooooooong, max 1024 chars!").catch(msgErrorHandler);

    try {
      // maybe the emoji text is longer, so no msgErrorHandler()
      return await message.reply(await Emojify(args.join(" ")));
    } catch (error) {
      return await message.reply("Text is too long, make it shorter so that i can send it").catch(msgErrorHandler);
    }
  },
};
