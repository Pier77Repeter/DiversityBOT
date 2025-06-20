const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "deepfry",
  description: "Image command with effect deepfry",
  async execute(client, message, args) {
    return await discImgGen(client, message, "deepfry", message.mentions.members.first());
  },
};
