const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, time } = require("discord.js");

module.exports = {
  name: "menu",
  description: "Replies with a test menu",
  async execute(client, message, args) {
    // creating a menu, format id is menu-<commandName>-<menuName>
    const menu = new StringSelectMenuBuilder()
      .setCustomId("menu-menu-menu")
      .setPlaceholder("Choose!")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Get the Biden blast")
          .setDescription("Very OP weapon")
          .setValue("bidenBlast"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Curse of RA")
          .setDescription("Old but effective weapon")
          .setValue("curseOfRA"),
        new StringSelectMenuOptionBuilder().setLabel("Bob").setDescription("justBob").setValue("bob")
      );

    // creating the menu row
    const menuRow = new ActionRowBuilder().addComponents(menu);

    // reply message with the menu
    var sentMessage;

    try {
      sentMessage = await message.reply({ content: "Choose your weapon", components: [menuRow] });
    } catch (error) {
      return;
    }

    const menuCollector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.StringSelect, // menu option type
      time: 15_000, // 15 secs
    });

    // when the menu is clicked event
    menuCollector.on("collect", async (menuInteraction) => {
      // always check if the user is the author
      if (menuInteraction.user.id !== message.author.id)
        try {
          return await menuInteraction.reply({
            content: "This menu isn't for you!",
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          return;
        }

      // checking which interaction was selected
      if (menuInteraction.customId === "menu-menu-menu") {
        menuCollector.resetTimer();
        // checking which option was selected menuInteraction.values[0] to get the options (this is the first option)
        switch (menuInteraction.values[0]) {
          case "bidenBlast":
            try {
              await menuInteraction.update({
                content: "Biden blast selected",
                components: [menuRow],
              });
            } catch (error) {
              return;
            }
            break;
          case "curseOfRA":
            try {
              await menuInteraction.update({
                content: "Curse of RA selected",
                components: [menuRow],
              });
            } catch (error) {
              return;
            }
            break;
          case "bob":
            try {
              await menuInteraction.update({
                content: "Bob selected",
                components: [menuRow],
              });
            } catch (error) {
              return;
            }
            break;
        }
      }
    });

    menuCollector.on("end", async () => {
      menu.setDisabled(true);
      return;
    });
  },
};
