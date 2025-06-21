const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "bobross",
  description: "Image command with effect bobross",
  async execute(client, message, args) {
    return await discImgGen(client, message, "bobross");
  },
};
