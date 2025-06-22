const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "tatoo",
  description: "Image command with effect tatoo",
  async execute(client, message, args) {
    return await discImgGen(client, message, "tatoo");
  },
};
