const { EmbedBuilder } = require("discord.js");
const listsGetRandomItem = require("../../utils/listsGetRandomItem");

module.exports = {
  name: "8ball",
  description: "8ball gives random reply to a question",
  async execute(client, message, args) {
    // compact way to check and reply
    try {
      if (args.length < 1) return await message.reply(message.author.username + " what is your beautiful question?");
    } catch (error) {
      return;
    }

    const ball8MessageEmbed = new EmbedBuilder()
      .setColor(0xff6666)
      .setDescription(
        [
          message.author.username,
          ", ",
          listsGetRandomItem(
            [
              "I can't answer",
              "yes",
              "no",
              "idk",
              "What about...yes.",
              "What about...no.",
              "Most probably yes",
              "Most probably no",
              "For me its a yes",
              "For me its a no",
              "It's a problem if i say yes?",
              "hahaha no",
              "Yes it is",
              "No it isnt",
              "JA!",
              "Nein",
              "I really don't know",
              "Boy don't ask to me",
              "Up to you",
              "I don't know what to say",
              "What the fuck are you saying?! Ask again!",
              "I don't think so",
              "Is it a problem if i say yes?",
              "Is it a problem if i say no?",
              "Ah",
              "Eh",
              "...",
              "mh?",
              "What?",
              "Ask again man",
              "You can try.",
              "Probably",
              "soon",
            ],
            false
          ),
        ].join("")
      );

    try {
      return await message.reply({ embeds: [ball8MessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
