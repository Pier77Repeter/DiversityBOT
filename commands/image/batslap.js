const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "batslap",
  description: "Image command with effect batslap",
  async execute(client, message, args) {
    // in this case it requiers 2 avatars
    return await discImgGen(client, message, "batslap", message.mentions.members.first());
  },
};
