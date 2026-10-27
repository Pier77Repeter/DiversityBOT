const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "deepfry",
  description: "Image command with effect deepfry",
  async execute(client, message, args) {
    discImgGen(client, message, "deepfry");
  },
};
