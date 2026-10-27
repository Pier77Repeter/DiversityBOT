const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "triggered",
  description: "Image command with effect triggered",
  async execute(client, message, args) {
    discImgGen(client, message, "triggered");
  },
};
