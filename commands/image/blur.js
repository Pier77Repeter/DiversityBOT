const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "blur",
  description: "Image command with effect blur",
  async execute(client, message, args) {
    return await discImgGen(client, message, "blur");
  },
};
