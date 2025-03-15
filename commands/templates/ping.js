module.exports = {
  name: "ping", // command name (used in messages)
  description: "Replies with Pong!", // optional description
  async execute(client, message, args) {
    // function to execute when the command is called
    try {
      return await message.reply("Pong!");
    } catch (error) {
      return;
    }
  },
};
