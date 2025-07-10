const { TwoZeroFourEight } = require("discord-gamecord");

module.exports = {
  name: "2048",
  description: "Play 2048 with yourself",
  async execute(client, message, args) {
    const twoZeroFourEight = new TwoZeroFourEight({
      message: message,
      isSlashGame: false,
      embed: {
        title: "2048",
        color: "#5865F2",
      },
      emojis: {
        up: "⬆️",
        down: "⬇️",
        left: "⬅️",
        right: "➡️",
      },
      timeoutTime: 30_000,
      buttonStyle: "PRIMARY",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    try {
      twoZeroFourEight.startGame();
    } catch (error) {
      return;
    }
  },
};
