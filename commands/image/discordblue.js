const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "discordblue",
  description: "Image command with effect discordblue",
  async execute(client, message, args) {
    return await discImgGen(client, message, "discordblue", message.mentions.members.first());
  },
};
