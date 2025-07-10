const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "mms",
  description: "Image command with effect mms",
  async execute(client, message, args) {
    return await discImgGen(client, message, "mms");
  },
};
