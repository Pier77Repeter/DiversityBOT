const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "stonk",
  description: "Image command with effect stonk",
  async execute(client, message, args) {
    return await discImgGen(client, message, "stonk");
  },
};
