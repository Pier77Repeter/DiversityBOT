const { FindEmoji } = require("discord-gamecord");

module.exports = {
  name: "findemoji",
  description: "Play find the emoji",
  async execute(client, message, args) {
    const findEmoji = new FindEmoji({
      message: message,
      isSlashGame: false,
      embed: {
        title: "Find the emoji",
        color: "#5865F2",
        description: "Remember the emojis from the board below.",
        findDescription: "Find the {emoji} emoji before the time runs out.",
      },
      timeoutTime: 60_000,
      hideEmojiTime: 5000,
      buttonStyle: "PRIMARY",
      emojis: ["🍉", "🍇", "🍊", "🍋", "🥭", "🍎", "🍏", "🥝"],
      winMessage: "You won! You selected the correct emoji. {emoji}",
      loseMessage: "You lost! You selected the wrong emoji. {emoji}",
      timeoutMessage: "You lost! You ran out of time. The emoji is {emoji}",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    try {
      return await findEmoji.startGame();
    } catch (error) {
      return;
    }
  },
};
