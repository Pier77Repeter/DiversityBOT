const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "ad",
  description: "Image command with effect ad",
  async execute(client, message, args) {
    // look at discImgGen so you understand how it works!!!!
    discImgGen(client, message, "ad");
  },
};
