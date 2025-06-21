const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "jail",
  description: "Image command with effect jail",
  async execute(client, message, args) {
    return await discImgGen(client, message, "jail");
  },
};
