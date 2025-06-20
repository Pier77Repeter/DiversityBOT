const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "denoise",
  description: "Image command with effect denoise",
  async execute(client, message, args) {
    return await discImgGen(client, message, "denoise", message.mentions.members.first());
  },
};
