const { Slots } = require("discord-gamecord");

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
      slots.startGame();
    } catch (error) {
      return;
    }
  },
};
