const discImgGen = require("../../utils/discImgGen");

module.exports = {
  name: "beautiful",
  description: "Image command with effect beautiful",
  async execute(client, message, args) {
    discImgGen(client, message, "beautiful");
  },
};
