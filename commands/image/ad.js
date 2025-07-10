const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "ad",
  description: "Image command with effect ad",
  async execute(client, message, args) {
    // look at discImgGen so you understand how it works!!!!
    return await discImgGen(client, message, "ad");
  },
};
