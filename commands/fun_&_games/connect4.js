const { Connect4 } = require("discord-gamecord");

module.exports = {
  name: "connect4",
  description: "Play connect4 with mentioned user",
  async execute(client, message, args) {
    try {
      if (message.mentions.members.first() == null)
        return await message.reply(message.author.username + ", you need someone to play with!");
    } catch (error) {
      return;
    }

    const connectFour = new Connect4({
      message: message,
      isSlashGame: false,
      opponent: message.mentions.users.first(),
      embed: {
        title: "Connect4 Game",
        statusTitle: "Status",
        color: "#5865F2",
      },
      emojis: {
        board: "⚪",
        player1: "🔴",
        player2: "🟡",
      },
      mentionUser: true,
      timeoutTime: 60_000,
      buttonStyle: "PRIMARY",
      turnMessage: "{emoji} | Its turn of player **{player}**.",
      winMessage: "{emoji} | **{player}** won the Connect4 Game.",
      tieMessage: "The Game tied! No one won the Game!",
      timeoutMessage: "The Game went unfinished! No one won the Game!",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
    });

    try {
      connectFour.startGame();
    } catch (error) {
      return;
    }
  },
};
