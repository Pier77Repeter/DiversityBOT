const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "invert",
  description: "Image command with effect invert",
  async execute(client, message, args) {
    discImgGen(client, message, "invert");
  },
};
