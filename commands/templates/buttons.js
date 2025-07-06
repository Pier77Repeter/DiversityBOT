const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  name: "buttons",
  description: "Test more buttons command",
  async execute(client, message, args) {
    // creating the buttons, button id must have the following format: "btn-<commandName>-<buttonName>", label is the name of the button, button style is color
    const btnOne = new ButtonBuilder().setCustomId("btn-buttons-btnOne").setLabel("Change red").setStyle(ButtonStyle.Danger);
    const btnTwo = new ButtonBuilder().setCustomId("btn-buttons-btnTwo").setLabel("Change green").setStyle(ButtonStyle.Success);
    const btnThree = new ButtonBuilder().setCustomId("btn-buttons-btnThree").setLabel("Change blue").setStyle(ButtonStyle.Primary);

    // every button must be assigned in a row, and the row will be sent in the message.reply()
    const actionRow = new ActionRowBuilder().addComponents(btnOne, btnTwo, btnThree);

    // creating the embed
    const embed = new EmbedBuilder().setColor(0x00ff00).setTitle("Choose one of the buttons");

    // saving the message the bot sent into a variable for later
    var sentMessage;

    // as always putting the message.reply() in try-catch
    try {
      // to send the button row we gotta do '{ components: [btnRow1, btnRow2] }'
      sentMessage = await message.reply({ embeds: [embed], components: [actionRow] });
    } catch (error) {
      return; // stop the command execution, no longer needed since we couldn't reply
    }

    // creating the t h i n g that will listen for the button click and we assosiate with the sentMessage
    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button, // type of the collector
      time: 20_000, // 20 secs (in milisecs), after that it will stop listening
    });

    // when button is clicked logic...
    collector.on("collect", async (btnInteraction) => {
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

      // the timer (20s) will return back to 20s when the button is clicked
      collector.resetTimer();

      // checking which button was clicked (because it checks all buttons)
      switch (btnInteraction.customId) {
        case "btn-buttons-btnOne":
          embed.setColor(0xff0000).setTitle("Red embed");

          // disabling the clicked button, you can enabled it again by setting it to false
          btnOne.setDisabled(true);

          try {
            // updating the message sent by the bot with the updated embed AND actionRow (so that the changes we made are visible), we can only do that 1 time, after this we need to do: sentMessage.edit()
            return await btnInteraction.update({ content: "Updated the embed color to **RED**", embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
        case "btn-buttons-btnTwo":
          // doing the same thing as above
          embed.setColor(0x10ff00).setTitle("Green embed");
          btnTwo.setDisabled(true);

          try {
            return await btnInteraction.update({ content: "Updated the embed color to **GREEN**", embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
        case "btn-buttons-btnThree":
          embed.setColor(0x0004ff).setTitle("Blue embed");
          btnThree.setDisabled(true);

          try {
            return await btnInteraction.update({ content: "Updated the embed color to **BLUE**", embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
      }
    });

    // when the collectors timer ends (20s) we enter here
    collector.on("end", async () => {
      // disabling all the buttons because are now unusable
      btnOne.setDisabled(true);
      btnTwo.setDisabled(true);
      btnThree.setDisabled(true);

      try {
        // updating the message sent by the bot with the updated actionRow with all the buttons disabled
        return await sentMessage.update({ content: "Buttons has veen disabled! Time out", components: [actionRow] });
      } catch (error) {
        return;
      }
    });
  },
};
