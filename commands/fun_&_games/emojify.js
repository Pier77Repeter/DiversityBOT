const { Emojify } = require("discord-gamecord");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "emojify",
  description: "Convert your text into emojis",
  async execute(client, message, args) {
    // this is yet another way to check if there are args or not
    if (args.lenght == 0) {
      message.reply("Provide ***t e x t*** to convert into emojis").catch(msgErrorHandler);
      return;
    }
    if (args.lenght > 1024) {
      message.reply("Text is too looooooooooong, max 1024 chars!").catch(msgErrorHandler);
      return;
    }

    try {
      // maybe the emoji text is longer, so no msgErrorHandler()
      message.reply(await Emojify(args.join(" ")));
    } catch (error) {
      message.reply("Text is too long, make it shorter so that i can send it").catch(msgErrorHandler);
    }
  },
};
