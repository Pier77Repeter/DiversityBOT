const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "doublestonk",
  description: "Image command with effect doublestonk",
  async execute(client, message, args) {
    return await discImgGen(client, message, "doublestonk", message.mentions.members.first());
  },
};
