const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "hitler",
  description: "Image command with effect hitler",
  async execute(client, message, args) {
    discImgGen(client, message, "hitler");
  },
};
