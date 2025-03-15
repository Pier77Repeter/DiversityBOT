const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, ComponentType } = require("discord.js");

module.exports = {
  name: "rps",
  description: "Rock Paper Scissors game",
  async execute(client, message, args) {
    if (!message.mentions.members.first()) {
      try {
        return await message.reply("You need to mention an user to play rock paper scissors.");
      } catch (error) {
        return;
      }
    }

    const mentionedMember = message.mentions.members.first();

    if (mentionedMember.id === message.author.id) {
      try {
        return await message.reply("You can't play rock paper scissors with yourself.");
      } catch (error) {
        return;
      }
    }

    if (mentionedMember.user.bot) {
      try {
        return await message.reply("You can't play rock paper scissors with a bot (they wouldn't play with you).");
      } catch (error) {
        return;
      }
    }

    const rpsChoices = [
      { id: "btn-rps-btnRpsRock", name: "Rock", emoji: "🪨", beats: "Scissors" },
      { id: "btn-rps-btnRpsPaper", name: "Paper", emoji: "🧻", beats: "Rock" },
      { id: "btn-rps-btnRpsScissors", name: "Scissors", emoji: "✂️", beats: "Paper" },
    ];

    const btnRpsRock = new ButtonBuilder()
      .setCustomId("btn-rps-btnRpsRock")
      .setEmoji("🪨")
      .setLabel("Rock")
      .setStyle(ButtonStyle.Primary);
    const btnRpsPaper = new ButtonBuilder()
      .setCustomId("btn-rps-btnRpsPaper")
      .setEmoji("🧻")
      .setLabel("Paper")
      .setStyle(ButtonStyle.Primary);
    const btnRpsScissors = new ButtonBuilder()
      .setCustomId("btn-rps-btnRpsScissors")
      .setEmoji("✂️")
      .setLabel("Scissors")
      .setStyle(ButtonStyle.Primary);
    const btnsRow = new ActionRowBuilder().addComponents(btnRpsRock, btnRpsPaper, btnRpsScissors);

    const rpsMessageEmbed = new EmbedBuilder()
      .setColor(0x33ccff)
      .setTitle("Let's play!")
      .setDescription(`${mentionedMember.user.username} is choosing..`)
      .setFooter({ text: "Click one of the buttons to choose!" });

    var reply;
    try {
      reply = await message.reply({ embeds: [rpsMessageEmbed], components: [btnsRow] });
    } catch (error) {
      return;
    }

    const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 40_000 });

    let mentionedUserChoice = null;
    let authorChoice = null;
    let turn = mentionedMember.user.id;

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id === turn) {
        if (btnInteraction.user.id === mentionedMember.user.id) {
          mentionedUserChoice = rpsChoices.find((choice) => choice.id === btnInteraction.customId);

          try {
            await btnInteraction.reply({
              content: `You choose ${mentionedUserChoice.name} ${mentionedUserChoice.emoji}`,
              flags: MessageFlags.Ephemeral,
            });
          } catch (error) {
            return;
          }

          rpsMessageEmbed.setDescription(`${message.author.username}'s turn...`);
          try {
            await btnInteraction.update({ embeds: [rpsMessageEmbed] });
          } catch (error) {
            return;
          }

          turn = message.author.id;
        } else if (btnInteraction.user.id === message.author.id) {
          authorChoice = rpsChoices.find((choice) => choice.id === btnInteraction.customId);
        } else {
          try {
            await btnInteraction.reply({ content: "You are not in the game!", flags: MessageFlags.Ephemeral });
          } catch (error) {
            return;
          }
        }

        if (mentionedUserChoice && authorChoice) {
          collector.stop();
        }
      } else {
        try {
          await btnInteraction.reply({ content: "It's not your turn yet.", flags: MessageFlags.Ephemeral });
        } catch (error) {
          return;
        }
      }
    });

    collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        rpsMessageEmbed.setTitle("Rip").setDescription("Someone didn't respond in time >:(").setFooter({ text: null });
        btnRpsRock.setDisabled(true);
        btnRpsPaper.setDisabled(true);
        btnRpsScissors.setDisabled(true);

        try {
          await reply.edit({ embeds: [rpsMessageEmbed], components: [btnsRow] });
        } catch (error) {
          return;
        }
      } else if (mentionedUserChoice && authorChoice) {
        let result;

        if (authorChoice.beats === mentionedUserChoice.name) {
          result = `**${message.author.username} wins, GG!**`;
          rpsMessageEmbed.setTitle(`${message.author.username} 🏆`).setFooter(null);
        } else if (mentionedUserChoice.beats === authorChoice.name) {
          result = `**${mentionedMember.user.username} wins, GG!**`;
          rpsMessageEmbed.setTitle(`${mentionedMember.user.username} 🏆`).setFooter(null);
        } else {
          result = "**It's a tie!**";
          rpsMessageEmbed.setTitle("Nobody wins 🤷").setFooter(null);
        }

        rpsMessageEmbed.setDescription(
          [
            `${message.author.username} picked ${authorChoice.emoji}`,
            "\n",
            `${mentionedMember.user.username} picked ${mentionedUserChoice.emoji}`,
            "\n",
            result,
          ].join(" ")
        );

        btnRpsRock.setDisabled(true);
        btnRpsPaper.setDisabled(true);
        btnRpsScissors.setDisabled(true);

        try {
          await reply.edit({ embeds: [rpsMessageEmbed], components: [btnsRow] });
        } catch (error) {
          return;
        }
      }
    });
  },
};
