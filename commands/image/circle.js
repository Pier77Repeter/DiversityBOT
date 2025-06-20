const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "circle",
  description: "Image command with effect circle",
  async execute(client, message, args) {
    return await discImgGen(client, message, "circle", message.mentions.members.first());
  },
};
