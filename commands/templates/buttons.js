const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
  name: "buttons",
  description: "Test more buttons command",
  async execute(client, message, args) {
    // creating the buttons, button id must have the following format: "btn-<commandName>-<buttonName>"
    const btnOne = new ButtonBuilder().setCustomId("btn-buttons-btnOne").setLabel("Change red").setStyle(ButtonStyle.Danger);
    const btnTwo = new ButtonBuilder().setCustomId("btn-buttons-btnTwo").setLabel("Change green").setStyle(ButtonStyle.Success);
    const btnThree = new ButtonBuilder()
      .setCustomId("btn-buttons-btnThree")
      .setLabel("Change blue")
      .setStyle(ButtonStyle.Primary);

    // creating the btns row
    const btnsRow = new ActionRowBuilder().addComponents(btnOne, btnTwo, btnThree);

    // disabled version of the buttons
    const btnDisabledOne = new ButtonBuilder()
      .setCustomId("btn-buttons-btnOne")
      .setLabel("Change red")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true);
    const btnDisabledTwo = new ButtonBuilder()
      .setCustomId("btn-buttons-btnTwo")
      .setLabel("Change green")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true);
    const btnDisabledThree = new ButtonBuilder()
      .setCustomId("btn-buttons-btnThree")
      .setLabel("Change blue")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true);

    // disabled btns row
    const btnsDisabledRow = new ActionRowBuilder().addComponents(btnDisabledOne, btnDisabledTwo, btnDisabledThree);

    // creating the embed
    const messageEmbed = {
      title: "Choose one of the buttons",
      color: 0x00ff00,
    };

    // sending the embed with the button
    var sentMessage;

    try {
      sentMessage = await message.reply({ embeds: [messageEmbed], components: [btnsRow] });
    } catch (error) {
      return;
    }

    const btnCollector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 20_000, // 20 secs
    });

    btnCollector.on("collect", async (btnInteraction) => {
      // checking if the button was clicked by the message author
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await btnInteraction.reply({ content: "This button isn't for you!", ephemeral: true });
        } catch (error) {
          return;
        }
      }

      // checking which button was clicked (because it checks all buttons)
      switch (btnInteraction.customId) {
        case "btn-buttons-btnOne":
          btnCollector.resetTimer();
          const messageEmbedRed = { title: "Red embed", color: 0xff0000 };
          try {
            return await btnInteraction.update({
              content: "Updated the embed color to **RED**",
              embeds: [messageEmbedRed],
              components: [btnsDisabledRow],
            });
          } catch (error) {
            return;
          }
          break;
        case "btn-buttons-btnTwo":
          btnCollector.resetTimer();
          const messageEmbedGreen = { title: "Green embed", color: 0x10ff00 };
          try {
            return await btnInteraction.update({
              content: "Updated the embed color to **GREEN**",
              embeds: [messageEmbedGreen],
              components: [btnsDisabledRow],
            });
          } catch (error) {
            return;
          }
          break;
        case "btn-buttons-btnThree":
          btnCollector.resetTimer();
          const messageEmbedBlue = { title: "Blue embed", color: 0x0004ff };
          try {
            return await btnInteraction.update({
              content: "Updated the embed color to **BLUE**",
              embeds: [messageEmbedBlue],
              components: [btnsDisabledRow],
            });
          } catch (error) {
            return;
          }
          break;
      }
    });

    btnCollector.on("end", async () => {
      btnOne.setDisabled(true);
      btnTwo.setDisabled(true);
      btnThree.setDisabled(true);
      try {
        return await message.reply({ content: "Buttons has veen disabled! Time out", components: [btnTwo] });
      } catch (error) {
        return;
      }
    });
  },
};
