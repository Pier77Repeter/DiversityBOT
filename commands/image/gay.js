const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "gay",
  description: "Image command with effect gay",
  async execute(client, message, args) {
    return await discImgGen(client, message, "gay");
  },
};
