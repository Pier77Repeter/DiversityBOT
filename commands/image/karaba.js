const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "karaba",
  description: "Image command with effect karaba",
  async execute(client, message, args) {
    return await discImgGen(client, message, "karaba");
  },
};
