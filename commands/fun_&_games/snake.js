const { Snake } = require("discord-gamecord");

module.exports = {
  name: "snake",
  description: "Play snake game like on Google",
  async execute(client, message, args) {
    const snake = new Snake({
      message: message,
      isSlashGame: false,
      embed: {
        title: "Snake Game",
        overTitle: "Game Over",
        color: "#5865F2",
      },
      emojis: {
        board: "⬛",
        food: "🍎",
        up: "⬆️",
        down: "⬇️",
        left: "⬅️",
        right: "➡️",
      },
      snake: { head: "🟢", body: "🟩", tail: "🟢", skull: "💀" },
      foods: ["🍎", "🍇", "🍊", "🫐", "🥕", "🥝", "🌽"],
      stopButton: "Stop",
      timeoutTime: 60_000,
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    try {
      snake.startGame();
    } catch (error) {
      return;
    }
  },
};
