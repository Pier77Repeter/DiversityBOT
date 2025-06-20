const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "clown",
  description: "Image command with effect clown",
  async execute(client, message, args) {
    return await discImgGen(client, message, "clown", message.mentions.members.first());
  },
};
