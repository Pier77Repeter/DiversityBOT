const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "snyder",
  description: "Image command with effect snyder",
  async execute(client, message, args) {
    return await discImgGen(client, message, "snyder");
  },
};
