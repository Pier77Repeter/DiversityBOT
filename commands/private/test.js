const msgErrorHandler = require("../../utils/msgErrorHandler");

// used for testing during development
module.exports = {
  name: "test",
  description: "Replies with Pong!",
  async execute(client, message, args) {
    return await message.reply("Test!").catch(msgErrorHandler);
  },
};
