const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "wanted",
  description: "Image command with effect wanted",
  async execute(client, message, args) {
    discImgGen(client, message, "wanted");
  },
};
