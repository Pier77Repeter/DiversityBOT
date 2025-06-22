const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "notstonk",
  description: "Image command with effect notstonk",
  async execute(client, message, args) {
    return await discImgGen(client, message, "notstonk");
  },
};
