const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "thomas",
  description: "Image command with effect thomas",
  async execute(client, message, args) {
    return await discImgGen(client, message, "thomas");
  },
};
