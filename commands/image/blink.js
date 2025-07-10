const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "blink",
  description: "Image command with effect blink",
  async execute(client, message, args) {
    return await discImgGen(client, message, "blink", message.mentions.members.first());
  },
};
