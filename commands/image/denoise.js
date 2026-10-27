const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "denoise",
  description: "Image command with effect denoise",
  async execute(client, message, args) {
    discImgGen(client, message, "denoise");
  },
};
