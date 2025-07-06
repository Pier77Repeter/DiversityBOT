const { TicTacToe } = require("discord-gamecord");

module.exports = {
  name: "ttt",
  description: "Play tic tac toe with mentioned user",
  async execute(client, message, args) {
    try {
      if (message.mentions.members.first() == null) return await message.reply(message.author.username + ", can't play alone, mention a buddy");
    } catch (error) {
      return;
    }

    const ttt = new TicTacToe({
      message: message,
      isSlashGame: false,
      opponent: message.mentions.users.first(),
      embed: {
        title: "Tic Tac Toe",
        color: "#5865F2",
        statusTitle: "Status",
        overTitle: "Game Over",
      },
      emojis: {
        xButton: "❌",
        oButton: "🔵",
        blankButton: "➖",
      },
      mentionUser: true,
      timeoutTime: 60_000,
      xButtonStyle: "DANGER",
      oButtonStyle: "PRIMARY",
      turnMessage: "{emoji} | Its turn of player **{player}**.",
      winMessage: "{emoji} | **{player}** won the TicTacToe Game.",
      tieMessage: "The Game tied! No one won the Game!",
      timeoutMessage: "The Game went unfinished! No one won the Game!",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
    });

    try {
      ttt.startGame();
    } catch (error) {
      return;
    }
  },
};
