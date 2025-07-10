const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "trash",
  description: "Image command with effect trash",
  async execute(client, message, args) {
    return await discImgGen(client, message, "trash");
  },
};
