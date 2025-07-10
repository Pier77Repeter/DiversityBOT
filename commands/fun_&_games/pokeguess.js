const { GuessThePokemon } = require("discord-gamecord");

module.exports = {
  name: "pokeguess",
  description: "Find the pokemoon!",
  async execute(client, message, args) {
    const pokeGuess = new GuessThePokemon({
      message: message,
      isSlashGame: false,
      embed: {
        title: "Who's The Pokemon",
        color: "#5865F2",
      },
      timeoutTime: 60_000,
      winMessage: "You guessed it right! It was a {pokemon}.",
      loseMessage: "Better luck next time! It was a {pokemon}.",
      errMessage: "Unable to fetch pokemon data! Please try again.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    try {
      pokeGuess.startGame();
    } catch (error) {
      return;
    }
  },
};
