const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "mirrorver",
  description: "Image command with effect mirrorver",
  async execute(client, message, args) {
    return await discImgGen(client, message, "mirrorver");
  },
};
