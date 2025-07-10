const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "greyscale",
  description: "Image command with effect greyscale",
  async execute(client, message, args) {
    return await discImgGen(client, message, "greyscale");
  },
};
