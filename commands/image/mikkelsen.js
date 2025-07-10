const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "mikkelsen",
  description: "Image command with effect mikkelsen",
  async execute(client, message, args) {
    return await discImgGen(client, message, "mikkelsen");
  },
};
