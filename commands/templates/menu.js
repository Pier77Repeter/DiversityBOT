const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, MessageFlags } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "menu",
  description: "Replies with a test menu",
  async execute(client, message, args) {
    // creating a menu, format id is menu-<commandName>-<menuName>
    const menu = new StringSelectMenuBuilder()
      .setCustomId("menu-menu-menu")
      .setPlaceholder("Choose!")
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel("Get the Biden blast").setDescription("Very OP weapon").setValue("bidenBlast"),
        new StringSelectMenuOptionBuilder().setLabel("Curse of RA").setDescription("Old but effective weapon").setValue("curseOfRA"),
        new StringSelectMenuOptionBuilder().setLabel("Bob").setDescription("justBob").setValue("bob"),
      );

    // creating the menu row
    const actionRow = new ActionRowBuilder().addComponents(menu);

    // reply message with the menu
    const sentMessage = await message.reply({ content: "Choose your weapon", components: [actionRow] }).catch(msgErrorHandler);

    // if an error happens (managed by msgErrorHandler) while sending the message we can safely stop executing this command as sentMessage is undefined
    if (!sentMessage) return;

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.StringSelect, // menu option type
      time: 15_000, // 15 secs
    });

    // when the menu is clicked event
    collector.on("collect", async (menuInteraction) => {
      // always check if the user is the author
      if (menuInteraction.user.id !== message.author.id) {
        menuInteraction.reply({ content: "This menu isn't for you!", flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
        return;
      }

      collector.resetTimer();

      // checking which interaction was selected
      if (menuInteraction.customId === "menu-menu-menu") {
        // checking which option was selected menuInteraction.values[0] to get the options (this is the first option)
        switch (menuInteraction.values[0]) {
          case "bidenBlast":
            // update the interaction, we can only do that 1 time, after this we need to do: sentMessage.edit()
            menuInteraction.update({ content: "Biden blast selected", components: [actionRow] }).catch(msgErrorHandler);
            break;

          case "curseOfRA":
            menuInteraction.update({ content: "Curse of RA selected", components: [actionRow] }).catch(msgErrorHandler);
            break;

          case "bob":
            menuInteraction.update({ content: "Bob selected", components: [actionRow] }).catch(msgErrorHandler);
            break;
        }
      }
    });

    collector.on("end", async () => {
      menu.setDisabled(true); // disabling the menu

      // update the menu when disabled
      sentMessage.edit({ content: "Bob selected", components: [actionRow] }).catch(msgErrorHandler);
    });
  },
};
