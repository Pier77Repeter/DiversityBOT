const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "discordblack",
  description: "Image command with effect discordblack",
  async execute(client, message, args) {
    discImgGen(client, message, "discordblack");
  },
};
