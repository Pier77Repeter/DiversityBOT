const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "spank",
  description: "Image command with effect spank",
  async execute(client, message, args) {
    return await discImgGen(client, message, "spank", message.mentions.members.first());
  },
};
