const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "heartbreaking",
  description: "Image command with effect heartbreaking",
  async execute(client, message, args) {
    return await discImgGen(client, message, "heartbreaking");
  },
};
