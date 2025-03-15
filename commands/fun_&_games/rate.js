const { EmbedBuilder } = require("discord.js");
const mathRandomInt = require("../../utils/mathRandomInt");

module.exports = {
  name: "rate",
  description: "Rate something the user wants",
  async execute(client, message, args) {
    const rateMessageEmbed = new EmbedBuilder().setColor(0x999900);

    const randomChoiceNumber = mathRandomInt(0, 10);

    if (randomChoiceNumber == 0) {
      rateMessageEmbed.setDescription(
        [message.author.username, ", EEEEWWW, i rate that a 0/10, BAD! very bad 👎👎👎"].join("")
      );
    } else if (randomChoiceNumber > 0 && randomChoiceNumber < 5) {
      rateMessageEmbed.setDescription([message.author.username, ", ugly, i give a " + randomChoiceNumber + "/10 👎"].join(""));
    } else if (randomChoiceNumber == 5) {
      rateMessageEmbed.setDescription([message.author.username, ", meh, i'd say a 5/10 🤔"].join(""));
    } else if (randomChoiceNumber > 5 && randomChoiceNumber < 10) {
      rateMessageEmbed.setDescription(
        [message.author.username, ", looks good, i say " + randomChoiceNumber + "/10 👍"].join("")
      );
    } else if (randomChoiceNumber == 10) {
      rateMessageEmbed.setDescription([message.author.username, ", no doubts it's a **10/10** 👍👍👍"].join(""));
    }

    try {
      return await message.reply({ embeds: [rateMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
