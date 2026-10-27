const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "affect",
  description: "Image command with effect affect",
  async execute(client, message, args) {
    discImgGen(client, message, "affect");
  },
};
