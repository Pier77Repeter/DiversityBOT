const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  name: "buttons",
  description: "Test more buttons command",
  async execute(client, message, args) {
    // creating the buttons, button id must have the following format: "btn-<commandName>-<buttonName>", label is the name of the button, button style is color
    const btnOne = new ButtonBuilder().setCustomId("btn-buttons-btnOne").setLabel("Change red").setStyle(ButtonStyle.Danger);
    const btnTwo = new ButtonBuilder().setCustomId("btn-buttons-btnTwo").setLabel("Change green").setStyle(ButtonStyle.Success);
    const btnThree = new ButtonBuilder()
      .setCustomId("btn-buttons-btnThree")
      .setLabel("Change blue")
      .setStyle(ButtonStyle.Primary);

    // every button must be assigned in a row, and the row will be sent in the message.reply()
    const btnsRow = new ActionRowBuilder().addComponents(btnOne, btnTwo, btnThree);

    // disabled version of the buttons
    const btnDisabledOne = new ButtonBuilder()
      .setCustomId("btn-buttons-btnOne")
      .setLabel("Change red")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true); // this disabled the button
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

    // creating another row for the disabled buttons (optional)
    const btnsDisabledRow = new ActionRowBuilder().addComponents(btnDisabledOne, btnDisabledTwo, btnDisabledThree);

    // creating the embed
    const buttonsMessageEmbed = new EmbedBuilder().setColor(0x00ff00).setTitle("Choose one of the buttons");

    // saving the message the bot sent into a variable for later
    var sentMessage;

    // as always putting the message.reply() in try-catch
    try {
      // to send the button row we gotta do '{ components: [btnRow1, btnRow2] }'
      sentMessage = await message.reply({ embeds: [buttonsMessageEmbed], components: [btnsRow] });
    } catch (error) {
      return; // stop the command execution, no longer needed since we couldn't reply
    }

    // creating the t h i n g that will listen for the button click and we assosiate with the sentMessage
    const btnCollector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button, // type of the collector
      time: 20_000, // 20 secs (in milisecs), after that it will stop listening
    });

    // when button is click logic...
    btnCollector.on("collect", async (btnInteraction) => {
      // when button is clicked it creates an interaction, we need to get the infos inside the btnInteraction obj, (btw i named it like that because it's an interaction coming from a button)
      // checking if the button was clicked by the message author by id
      if (btnInteraction.user.id !== message.author.id) {
        try {
          // answering the dude who generated the button interaction, to make this visible obly to the dude who clicked, we put the 'flags:' option, and set that this message is ephermeral by 'MessageFlags.Ephemeral'
          return await btnInteraction.reply({ content: "This button isn't for you!", flags: MessageFlags.Ephemeral });
        } catch (error) {
          return;
        }
      }

      // checking which button was clicked (because it checks all buttons)
      switch (btnInteraction.customId) {
        case "btn-buttons-btnOne":
          // the timer (20s) will return back to 20s when the button is clicked
          btnCollector.resetTimer();

          const messageEmbedRed = new EmbedBuilder(0xff0000).setColor().setTitle("Red embed");

          try {
            // updating the message where we attached the original btnRow
            return await btnInteraction.update({
              content: "Updated the embed color to **RED**",
              embeds: [messageEmbedRed],
              components: [btnsDisabledRow],
            });
          } catch (error) {
            return;
          }
        case "btn-buttons-btnTwo":
          btnCollector.resetTimer();

          const messageEmbedGreen = new EmbedBuilder(0x10ff00).setColor().setTitle("Green embed");

          try {
            return await btnInteraction.update({
              content: "Updated the embed color to **GREEN**",
              embeds: [messageEmbedGreen],
              components: [btnsDisabledRow],
            });
          } catch (error) {
            return;
          }
        case "btn-buttons-btnThree":
          btnCollector.resetTimer();

          const messageEmbedBlue = new EmbedBuilder(0x0004ff).setColor().setTitle("Blue embed");

          try {
            return await btnInteraction.update({
              content: "Updated the embed color to **BLUE**",
              embeds: [messageEmbedBlue],
              components: [btnsDisabledRow],
            });
          } catch (error) {
            return;
          }
      }
    });

    // when the collectors timer ends (20s) we enter here
    btnCollector.on("end", async () => {
      // disabling the buttons on the original btnRow
      btnOne.setDisabled(true);
      btnTwo.setDisabled(true);
      btnThree.setDisabled(true);

      try {
        // sending again the btnRow to update/show the disables buttons
        return await message.reply({ content: "Buttons has veen disabled! Time out", components: [btnTwo] });
      } catch (error) {
        return;
      }
    });
  },
};
