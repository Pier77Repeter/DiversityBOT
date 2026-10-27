const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "mms",
  description: "Image command with effect mms",
  async execute(client, message, args) {
    discImgGen(client, message, "mms");
  },
};
