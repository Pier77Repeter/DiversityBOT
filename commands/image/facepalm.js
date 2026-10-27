const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "facepalm",
  description: "Image command with effect facepalm",
  async execute(client, message, args) {
    discImgGen(client, message, "facepalm");
  },
};
