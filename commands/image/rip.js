const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "rip",
  description: "Image command with effect rip",
  async execute(client, message, args) {
    discImgGen(client, message, "rip");
  },
};
