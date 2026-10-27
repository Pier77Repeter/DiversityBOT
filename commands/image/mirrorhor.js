const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "mirrorhor",
  description: "Image command with effect mirrorhor",
  async execute(client, message, args) {
    discImgGen(client, message, "mirrorhor");
  },
};
