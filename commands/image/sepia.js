const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "sepia",
  description: "Image command with effect sepia",
  async execute(client, message, args) {
    discImgGen(client, message, "sepia");
  },
};
