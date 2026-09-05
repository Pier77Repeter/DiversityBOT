const { Slots } = require("discord-gamecord");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "slots",
  description: "Gambling gambling gambling gambling gambling gambling gambling",
  async execute(client, message, args) {
    const slots = new Slots({
      message: message,
      isSlashGame: false,
      embed: {
        title: "Slot Machine",
        color: "#5865F2",
      },
      slots: ["🍇", "🍊", "🍋", "🍌"],
    });

    try {
      return await slots.startGame();
    } catch (error) {
      return msgErrorHandler(error);
    }
  },
};
