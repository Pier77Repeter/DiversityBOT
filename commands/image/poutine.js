const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "poutine",
  description: "Image command with effect poutine",
  async execute(client, message, args) {
    return await discImgGen(client, message, "poutine");
  },
};
