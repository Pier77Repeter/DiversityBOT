const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "delete",
  description: "Image command with effect delete",
  async execute(client, message, args) {
    return await discImgGen(client, message, "delete", message.mentions.members.first());
  },
};
