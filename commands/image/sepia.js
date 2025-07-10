const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "sepia",
  description: "Image command with effect sepia",
  async execute(client, message, args) {
    return await discImgGen(client, message, "sepia");
  },
};
