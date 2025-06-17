const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "bed",
  description: "Image command with effect bed",
  async execute(client, message, args) {
    return await discImgGen(client, message, "bed", message.mentions.members.first());
  },
};
