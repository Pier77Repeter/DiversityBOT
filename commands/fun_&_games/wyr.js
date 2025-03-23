const { WouldYouRather } = require("discord-gamecord");

module.exports = {
  name: "wyr",
  description: "Would you rather do...",
  async execute(client, message, args) {
    const wouldYouRather = new WouldYouRather({
      message: message,
      isSlashGame: false,
      embed: {
        title: "Would You Rather",
        color: "#5865F2",
      },
      buttons: {
        option1: "Option 1",
        option2: "Option 2",
      },
      timeoutTime: 60_000,
      errMessage: "Unable to fetch question data! Please try again.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    try {
      wouldYouRather.startGame();
    } catch (error) {
      return;
    }
  },
};
