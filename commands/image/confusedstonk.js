const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "confusedstonk",
  description: "Image command with effect confusedstonk",
  async execute(client, message, args) {
    discImgGen(client, message, "confusedstonk");
  },
};
