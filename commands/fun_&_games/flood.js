const { Flood } = require("discord-gamecord");

module.exports = {
  name: "flood",
  description: "Play flood game with yourself",
  async execute(client, message, args) {
    const flood = new Flood({
      message: message,
      isSlashGame: false,
      embed: {
        title: "Flood",
        color: "#5865F2",
      },
      difficulty: 13,
      timeoutTime: 60_000,
      buttonStyle: "PRIMARY",
      emojis: ["🟥", "🟦", "🟧", "🟪", "🟩"],
      winMessage: "You won! You took **{turns}** turns.",
      loseMessage: "You lost! You took **{turns}** turns.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    try {
      return await flood.startGame();
    } catch (error) {
      return;
    }
  },
};
