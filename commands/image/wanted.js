const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "wanted",
  description: "Image command with effect wanted",
  async execute(client, message, args) {
    return await discImgGen(client, message, "wanted");
  },
};
