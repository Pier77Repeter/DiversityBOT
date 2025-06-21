const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "facepalm",
  description: "Image command with effect facepalm",
  async execute(client, message, args) {
    return await discImgGen(client, message, "facepalm");
  },
};
