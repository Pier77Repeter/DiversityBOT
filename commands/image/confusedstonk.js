const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "confusedstonk",
  description: "Image command with effect confusedstonk",
  async execute(client, message, args) {
    return await discImgGen(client, message, "confusedstonk");
  },
};
