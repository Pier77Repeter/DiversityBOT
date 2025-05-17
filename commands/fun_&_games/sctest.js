const {
  EmbedBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  MessageFlags,
} = require("discord.js");
const cooldownManager = require("../../utils/cooldownManager");
const delay = require("../../utils/delay");

module.exports = {
  name: "sctest",
  description: "Starts the social credits test",
  cooldown: 90,
  async execute(client, message, args) {
    const cooldown = cooldownManager(client, message, "scTestCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      const scTestMessageEmbed = new EmbedBuilder()
        .setColor(0x000000)
        .setDescription("⏰ You you can do this test again: **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [scTestMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    const scThumbnailFile = new AttachmentBuilder("./media/scTestThumbnail.jpg");

    const scTestMessageEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("Social credit test")
      .setDescription("Are you sure to start the quiz?")
      .setImage("attachment://scTestThumbnail.jpg");

    const btnStartTestOne = new ButtonBuilder()
      .setCustomId("btn-sctest-testStartOne")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Success);
    const btnStartTestTwo = new ButtonBuilder()
      .setCustomId("btn-sctest-testStartTwo")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Success);

    const btnRow = new ActionRowBuilder().addComponents(btnStartTestOne, btnStartTestTwo);

    var sentMessage;
    try {
      sentMessage = await message.reply({ embeds: [scTestMessageEmbed], files: [scThumbnailFile], components: [btnRow] });
    } catch (error) {
      return;
    }

    var questionProgressCounter = 0;
    var testFinished = false;

    // This is where AI comes handy
    // Images
    const wrongAnswerImage = new AttachmentBuilder("./media/scTestWrongAnswer.jpg");
    const rightAnswerImage = new AttachmentBuilder("./media/scTestRightAnswer.jpg");
    const xiPortraitImage = new AttachmentBuilder("./media/scTestXi.jpg");
    const testCompletedImage = new AttachmentBuilder("./media/scTestComplete.jpg");

    // Right-Wrong embeds
    const scTestRightAnswerMessageEmbed = new EmbedBuilder()
      .setColor(0x33cc00)
      .setTitle("That's correct")
      .setDescription("You got +100000 Social credits")
      .setImage("attachment://scTestRightAnswer.jpg");

    const scTestWrongAnswerMessageEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("YOU LOST -999.999 SOCIAL CREDITS")
      .setThumbnail("https://c.tenor.com/prT_agJ7F98AAAAd/tenor.gif")
      .setImage("attachment://scTestWrongAnswer.jpg");

    // Test completed embed
    const scTestCompletedMessageEmbed = new EmbedBuilder()
      .setColor(0x33cc00)
      .setTitle("This is the end of the test")
      .setDescription("You got your well deserved +100000 Social credits")
      .setImage("attachment://scTestComplete.jpg")
      .setFooter({ text: "10/10 questions, amazing!" });

    // Question 1
    const btnQuestionOneA = new ButtonBuilder().setCustomId("btn-sctest-qOne-ansA").setLabel("A").setStyle(ButtonStyle.Primary);
    const btnQuestionOneB = new ButtonBuilder().setCustomId("btn-sctest-qOne-ansB").setLabel("B").setStyle(ButtonStyle.Primary);
    const btnQuestionOneC = new ButtonBuilder().setCustomId("btn-sctest-qOne-ansC").setLabel("C").setStyle(ButtonStyle.Primary);
    const btnQuestionOneD = new ButtonBuilder().setCustomId("btn-sctest-qOne-ansD").setLabel("D").setStyle(ButtonStyle.Primary);
    const btnRowQuestionOne = new ActionRowBuilder().addComponents(
      btnQuestionOneA,
      btnQuestionOneB,
      btnQuestionOneC,
      btnQuestionOneD
    );

    // Question 2
    const btnQuestionTwoA = new ButtonBuilder().setCustomId("btn-sctest-qTwo-ansA").setLabel("A").setStyle(ButtonStyle.Primary);
    const btnQuestionTwoB = new ButtonBuilder().setCustomId("btn-sctest-qTwo-ansB").setLabel("B").setStyle(ButtonStyle.Primary);
    const btnQuestionTwoC = new ButtonBuilder().setCustomId("btn-sctest-qTwo-ansC").setLabel("C").setStyle(ButtonStyle.Primary);
    const btnQuestionTwoD = new ButtonBuilder().setCustomId("btn-sctest-qTwo-ansD").setLabel("D").setStyle(ButtonStyle.Primary);
    const btnRowQuestionTwo = new ActionRowBuilder().addComponents(
      btnQuestionTwoA,
      btnQuestionTwoB,
      btnQuestionTwoC,
      btnQuestionTwoD
    );

    // Question 3
    const btnQuestionThreeA = new ButtonBuilder()
      .setCustomId("btn-sctest-qThree-ansA")
      .setLabel("A")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionThreeB = new ButtonBuilder()
      .setCustomId("btn-sctest-qThree-ansB")
      .setLabel("B")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionThreeC = new ButtonBuilder()
      .setCustomId("btn-sctest-qThree-ansC")
      .setLabel("C")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionThreeD = new ButtonBuilder()
      .setCustomId("btn-sctest-qThree-ansD")
      .setLabel("D")
      .setStyle(ButtonStyle.Primary);
    const btnRowQuestionThree = new ActionRowBuilder().addComponents(
      btnQuestionThreeA,
      btnQuestionThreeB,
      btnQuestionThreeC,
      btnQuestionThreeD
    );

    // Question 4
    const btnQuestionFourA = new ButtonBuilder()
      .setCustomId("btn-sctest-qFour-ansA")
      .setLabel("A")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionFourB = new ButtonBuilder()
      .setCustomId("btn-sctest-qFour-ansB")
      .setLabel("B")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionFourC = new ButtonBuilder()
      .setCustomId("btn-sctest-qFour-ansC")
      .setLabel("C")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionFourD = new ButtonBuilder()
      .setCustomId("btn-sctest-qFour-ansD")
      .setLabel("D")
      .setStyle(ButtonStyle.Primary);
    const btnRowQuestionFour = new ActionRowBuilder().addComponents(
      btnQuestionFourA,
      btnQuestionFourB,
      btnQuestionFourC,
      btnQuestionFourD
    );

    // Question 5
    const btnQuestionFiveA = new ButtonBuilder()
      .setCustomId("btn-sctest-qFive-ansA")
      .setLabel("A")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionFiveB = new ButtonBuilder()
      .setCustomId("btn-sctest-qFive-ansB")
      .setLabel("B")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionFiveC = new ButtonBuilder()
      .setCustomId("btn-sctest-qFive-ansC")
      .setLabel("C")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionFiveD = new ButtonBuilder()
      .setCustomId("btn-sctest-qFive-ansD")
      .setLabel("D")
      .setStyle(ButtonStyle.Primary);
    const btnRowQuestionFive = new ActionRowBuilder().addComponents(
      btnQuestionFiveA,
      btnQuestionFiveB,
      btnQuestionFiveC,
      btnQuestionFiveD
    );

    // Question 6
    const btnQuestionSixA = new ButtonBuilder().setCustomId("btn-sctest-qSix-ansA").setLabel("A").setStyle(ButtonStyle.Primary);
    const btnQuestionSixB = new ButtonBuilder().setCustomId("btn-sctest-qSix-ansB").setLabel("B").setStyle(ButtonStyle.Primary);
    const btnQuestionSixC = new ButtonBuilder().setCustomId("btn-sctest-qSix-ansC").setLabel("C").setStyle(ButtonStyle.Primary);
    const btnQuestionSixD = new ButtonBuilder().setCustomId("btn-sctest-qSix-ansD").setLabel("D").setStyle(ButtonStyle.Primary);
    const btnRowQuestionSix = new ActionRowBuilder().addComponents(
      btnQuestionSixA,
      btnQuestionSixB,
      btnQuestionSixC,
      btnQuestionSixD
    );

    // Question 7
    const btnQuestionSevenA = new ButtonBuilder()
      .setCustomId("btn-sctest-qSeven-ansA")
      .setLabel("A")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionSevenB = new ButtonBuilder()
      .setCustomId("btn-sctest-qSeven-ansB")
      .setLabel("B")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionSevenC = new ButtonBuilder()
      .setCustomId("btn-sctest-qSeven-ansC")
      .setLabel("C")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionSevenD = new ButtonBuilder()
      .setCustomId("btn-sctest-qSeven-ansD")
      .setLabel("D")
      .setStyle(ButtonStyle.Primary);
    const btnRowQuestionSeven = new ActionRowBuilder().addComponents(
      btnQuestionSevenA,
      btnQuestionSevenB,
      btnQuestionSevenC,
      btnQuestionSevenD
    );

    // Question 8
    const btnQuestionEightA = new ButtonBuilder()
      .setCustomId("btn-sctest-qEight-ansA")
      .setLabel("A")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionEightB = new ButtonBuilder()
      .setCustomId("btn-sctest-qEight-ansB")
      .setLabel("B")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionEightC = new ButtonBuilder()
      .setCustomId("btn-sctest-qEight-ansC")
      .setLabel("C")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionEightD = new ButtonBuilder()
      .setCustomId("btn-sctest-qEight-ansD")
      .setLabel("D")
      .setStyle(ButtonStyle.Primary);
    const btnRowQuestionEight = new ActionRowBuilder().addComponents(
      btnQuestionEightA,
      btnQuestionEightB,
      btnQuestionEightC,
      btnQuestionEightD
    );

    // Question 9
    const btnQuestionNineA = new ButtonBuilder()
      .setCustomId("btn-sctest-qNine-ansA")
      .setLabel("A")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionNineB = new ButtonBuilder()
      .setCustomId("btn-sctest-qNine-ansB")
      .setLabel("B")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionNineC = new ButtonBuilder()
      .setCustomId("btn-sctest-qNine-ansC")
      .setLabel("C")
      .setStyle(ButtonStyle.Primary);
    const btnQuestionNineD = new ButtonBuilder()
      .setCustomId("btn-sctest-qNine-ansD")
      .setLabel("D")
      .setStyle(ButtonStyle.Primary);
    const btnRowQuestionNine = new ActionRowBuilder().addComponents(
      btnQuestionNineA,
      btnQuestionNineB,
      btnQuestionNineC,
      btnQuestionNineD
    );

    // Question 10
    const btnQuestionTenA = new ButtonBuilder().setCustomId("btn-sctest-qTen-ansA").setLabel("A").setStyle(ButtonStyle.Primary);
    const btnQuestionTenB = new ButtonBuilder().setCustomId("btn-sctest-qTen-ansB").setLabel("B").setStyle(ButtonStyle.Primary);
    const btnQuestionTenC = new ButtonBuilder().setCustomId("btn-sctest-qTen-ansC").setLabel("C").setStyle(ButtonStyle.Primary);
    const btnQuestionTenD = new ButtonBuilder().setCustomId("btn-sctest-qTen-ansD").setLabel("D").setStyle(ButtonStyle.Primary);
    const btnRowQuestionTen = new ActionRowBuilder().addComponents(
      btnQuestionTenA,
      btnQuestionTenB,
      btnQuestionTenC,
      btnQuestionTenD
    );

    const btnCollector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30_000,
    });

    btnCollector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await message.reply({
            content: "Someone else is doing this test, try it with **d!sctest**",
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          return;
        }
      }

      btnCollector.resetTimer();

      switch (btnInteraction.customId) {
        case "btn-sctest-testStartOne":
          scTestMessageEmbed
            .setColor(0xff0000)
            .setTitle("Question 1: How many children should one family have?")
            .setDescription(["A) 4 twin", "\n", "B) 13", "\n", "C) Make as possible as you can", "\n", "D) 1"].join(""))
            .setThumbnail("attachment://scTestThumbnail.jpg")
            .setImage();

          try {
            await btnInteraction.update({
              embeds: [scTestMessageEmbed],
              files: [scThumbnailFile],
              components: [btnRowQuestionOne],
            });
          } catch (error) {
            return;
          }
          break;
        case "btn-sctest-testStartTwo":
          scTestMessageEmbed
            .setColor(0xff0000)
            .setTitle("Question 1: How many children should one family have?")
            .setDescription(["A) 4 twin", "\n", "B) 13", "\n", "C) Make as possible as you can", "\n", "D) 1"].join(""))
            .setThumbnail("attachment://scTestThumbnail.jpg")
            .setImage();

          try {
            await btnInteraction.update({
              embeds: [scTestMessageEmbed],
              files: [scThumbnailFile],
              components: [btnRowQuestionOne],
            });
          } catch (error) {
            return;
          }
          break;

        case "btn-sctest-qOne-ansA":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qOne-ansB":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qOne-ansC":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qOne-ansD":
          await correctAnswerHandler(
            btnInteraction,
            btnRowQuestionOne,
            btnQuestionOneD,
            "Question 2: How many hours do you play Games?",
            ["A) 4 hours", "\n", "B) 1 hour", "\n", "C) 5 min every weekend", "\n", "D) 1/3 hours"].join(""),
            btnRowQuestionTwo
          );
          break;

        case "btn-sctest-qTwo-ansA":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qTwo-ansB":
          await correctAnswerHandler(
            btnInteraction,
            btnRowQuestionTwo,
            btnQuestionTwoB,
            "Question 3: Which is better?",
            ["A) China", "\n", "B) USA", "\n", "C) France", "\n", "D) Russia"].join(""),
            btnRowQuestionThree
          );
          break;
        case "btn-sctest-qTwo-ansC":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qTwo-ansD":
          await wrongAnswerHandler(btnInteraction);
          break;

        case "btn-sctest-qThree-ansA":
          await correctAnswerHandler(
            btnInteraction,
            btnRowQuestionThree,
            btnQuestionThreeA,
            "Question 3: What happened on Tiananmen Square in 1989?",
            ["A) I don't remember", "\n", "B) Something", "\n", "C) Nothing", "\n", "D) A bad event"].join(""),
            btnRowQuestionFour
          );
          break;
        case "btn-sctest-qThree-ansB":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qThree-ansC":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qThree-ansD":
          await wrongAnswerHandler(btnInteraction);
          break;

        case "btn-sctest-qFour-ansA":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qFour-ansB":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qFour-ansC":
          await correctAnswerHandler(
            btnInteraction,
            btnRowQuestionFour,
            btnQuestionFourC,
            "Question 5: Is Taiwan a country?",
            ["A) No", "\n", "B) Well said", "\n", "C) Probably", "\n", "D) Yes"].join(""),
            btnRowQuestionFive
          );
          break;
        case "btn-sctest-qFour-ansD":
          await wrongAnswerHandler(btnInteraction);
          break;

        case "btn-sctest-qFive-ansA":
          scTestMessageEmbed.setImage("attachment://scTestXi.jpg");
          await correctAnswerHandler(
            btnInteraction,
            btnRowQuestionFive,
            btnQuestionFiveA,
            "Question 6: Who is this guy?",
            [
              "A) Winnie the Pooh",
              "\n",
              "B) I don't know",
              "\n",
              "C) Some random Chinese polician",
              "\n",
              "D) Xi Jinping",
            ].join(""),
            btnRowQuestionSix
          );
          break;
        case "btn-sctest-qFive-ansB":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qFive-ansC":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qFive-ansD":
          await wrongAnswerHandler(btnInteraction);
          break;

        case "btn-sctest-qSix-ansA":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qSix-ansB":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qSix-ansC":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qSix-ansD":
          scTestMessageEmbed.setImage();
          await correctAnswerHandler(
            btnInteraction,
            btnRowQuestionSix,
            btnQuestionSixD,
            "Question 7: A popular international singer held a concert in Tapei, they said they enjoyed performing and that Taiwan is a 'wonderful country'. Your reaction?",
            [
              "A) Nothing",
              "\n",
              "B) I hope they have a concert in my city too",
              "\n",
              "C) The Taiwan situation is complex, so it's common for people to mistake Taiwan as a country",
              "\n",
              "D) They should apologize and say Taiwan is a part of China/Not a country",
            ].join(""),
            btnRowQuestionSeven
          );
          break;

        case "btn-sctest-qSeven-ansA":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qSeven-ansB":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qSeven-ansC":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qSeven-ansD":
          await correctAnswerHandler(
            btnInteraction,
            btnRowQuestionSeven,
            btnQuestionSevenD,
            "Question 8: Best goverment system?",
            ["A) West democracy", "\n", "B) Socialism", "\n", "C) Communism", "\n", "D) Monarchy"].join(""),
            btnRowQuestionEight
          );
          break;

        case "btn-sctest-qEight-ansA":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qEight-ansB":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qEight-ansC":
          await correctAnswerHandler(
            btnInteraction,
            btnRowQuestionEight,
            btnQuestionEightC,
            "Question 9: What do you think about the Chinese Communist party?",
            [
              "A) They are rightful authorities of China",
              "\n",
              "B) They are not perfect but they govern China well",
              "\n",
              "C) They are totalitarian and dose not represent the Chinese people",
              "\n",
              "D) They are doing really bad things to people",
            ].join(""),
            btnRowQuestionNine
          );
          break;
        case "btn-sctest-qEight-ansD":
          await wrongAnswerHandler(btnInteraction);
          break;

        case "btn-sctest-qNine-ansA":
          await correctAnswerHandler(
            btnInteraction,
            btnRowQuestionNine,
            btnQuestionNineA,
            "Question 10: Xi Jinping looks like Winnie the Pooh?",
            ["A) Yes", "\n", "B) Not at all", "\n", "C) They are similar", "\n", "D) Totally"].join(""),
            btnRowQuestionTen
          );
          break;
        case "btn-sctest-qNine-ansB":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qNine-ansC":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qNine-ansD":
          await wrongAnswerHandler(btnInteraction);
          break;

        case "btn-sctest-qTen-ansA":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qTen-ansB":
          testFinished = true;
          btnInteraction.update({ embeds: [scTestCompletedMessageEmbed], files: [testCompletedImage], components: [] });
          break;
        case "btn-sctest-qTen-ansC":
          await wrongAnswerHandler(btnInteraction);
          break;
        case "btn-sctest-qTen-ansD":
          await wrongAnswerHandler(btnInteraction);
          break;
      }
    });

    btnCollector.on("end", async () => {
      if (testFinished) return;

      scTestMessageEmbed
        .setColor(0xff0000)
        .setTitle("The test has ended")
        .setDescription(
          "You didn't answer in time, you will now be monitored by the Chinese goverment until you finish the test"
        )
        .setFooter({ text: "Finish the test..." });

      try {
        return await sentMessage.edit({ embeds: [scTestMessageEmbed], files: [scThumbnailFile], components: [] });
      } catch (error) {
        return;
      }
    });

    async function correctAnswerHandler(
      btnInteraction,
      btnRowToDisable,
      correctBtn,
      nextQuestionTitle,
      nextQuestionDescription,
      nextQuestionBtnRow
    ) {
      await updateScCredits(100000);

      questionProgressCounter++;

      btnRowToDisable.components.forEach((btn) => {
        btn.setDisabled(true);
        if (btn.data.custom_id === correctBtn.data.custom_id) {
          btn.setStyle(ButtonStyle.Success);
        } else {
          btn.setStyle(ButtonStyle.Secondary);
        }
      });

      try {
        await btnInteraction.update({
          embeds: [scTestRightAnswerMessageEmbed.setFooter({ text: questionProgressCounter + "/10 questions" })],
          files: [rightAnswerImage],
          components: [btnRowToDisable],
        });
      } catch (error) {
        return;
      }

      await delay(3000);

      scTestMessageEmbed.setTitle(nextQuestionTitle).setDescription(nextQuestionDescription);

      if (correctBtn.data.custom_id === "btn-sctest-qFive-ansA") {
        try {
          return await sentMessage.edit({
            embeds: [scTestMessageEmbed],
            files: [scThumbnailFile, xiPortraitImage],
            components: [nextQuestionBtnRow],
          });
        } catch (error) {
          return;
        }
      }

      try {
        await sentMessage.edit({
          embeds: [scTestMessageEmbed],
          files: [scThumbnailFile],
          components: [nextQuestionBtnRow],
        });
      } catch (error) {
        return;
      }
    }

    async function wrongAnswerHandler(btnInteraction) {
      testFinished = true;
      await updateScCredits(-999999);

      try {
        // last thing we gonna do
        return await btnInteraction.update({
          embeds: [scTestWrongAnswerMessageEmbed],
          files: [wrongAnswerImage],
          components: [],
        });
      } catch (error) {
        return;
      }
    }

    async function updateScCredits(num) {
      await new Promise((resolve, reject) => {
        client.database.run(
          "UPDATE User SET socialCredits = socialCredits + ? WHERE serverId = ? AND userId = ?",
          [num, message.guild.id, message.author.id],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
  },
};
