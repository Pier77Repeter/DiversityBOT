// first command, each command has it's own file and it is inside this module.exports
module.exports = {
  // this is the name of the command, for example, in this case d!ping
  name: "ping",

  // optional description, may help to understand in short how it's supposed to work
  description: "Replies with Pong!",

  // the last requiered field in the module.exports for normal commands, the execute() function, command logic goes here
  async execute(client, message, args) {
    // before sending the message it needs to be surrounded with a try-catch block in case the original message is deleted
    try {
      // sending the reply, since it's the last thing it's gonna do, we returns with an 'await' because message.reply() is async
      return await message.reply("🏓 Pong!");
    } catch (error) {
      return; // in case of error, simply return, i don't want the consolo filled with shit because the bot couldn't reply
    }
  },
};
