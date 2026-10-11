const msgErrorHandler = require("../../utils/msgErrorHandler");

// first command, each command has it's own file and it is inside this module.exports
module.exports = {
  // this is the name of the command, for example, in this case d!ping
  name: "ping",

  // the same command can have different names, so we use these (see loader.js)
  aliases: ["pang", "pong"],

  // optional description, may help to understand in short how it's supposed to work
  description: "Replies with Pong!",

  // the last requiered field in the module.exports for normal commands, the execute() function, command logic goes here
  async execute(client, message, args) {
    // sending the reply, since it's the last thing it's gonna do, we returns with an 'await' because message.reply() is async
    // in case of error we are gonna check if the error is related to Discord API (not logged) or our code (logged)
    return await message.reply("🏓 Pong!").catch(msgErrorHandler);
  },
};
