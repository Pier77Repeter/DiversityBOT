const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags } = require("discord.js");
const logger = require("../logger")("EmbedPaginator");

// very sophisticated function to make embed impagination, only supports messages, not / commands
module.exports = async function embedPaginator(commandName, message, pages, time = 60 * 1000) {
  try {
    if (!commandName || !message || !pages || !pages > 0) throw new Error("Invalid or missing given arguments");

    // why call this function to only send 1 embed?
    if (pages.length === 1) {
      try {
        return await message.reply({ embeds: pages, components: [] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    let index = 0;

    const btnFirst = new ButtonBuilder().setCustomId(`btn-${commandName}-pageFirst`).setEmoji("⏮️").setStyle(ButtonStyle.Primary).setDisabled(true);
    const btnPrev = new ButtonBuilder().setCustomId(`btn-${commandName}-pagePrev`).setEmoji("⬅️").setStyle(ButtonStyle.Primary).setDisabled(true);
    const btnPageCount = new ButtonBuilder()
      .setCustomId(`btn-${commandName}-pageCount`)
      .setLabel(`${index + 1}/${pages.length}`)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);
    const btnNext = new ButtonBuilder().setCustomId(`btn-${commandName}-pageNext`).setEmoji("➡️").setStyle(ButtonStyle.Primary);
    const btnLast = new ButtonBuilder().setCustomId(`btn-${commandName}-pageLast`).setEmoji("⏭️").setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder().addComponents([btnFirst, btnPrev, btnPageCount, btnNext, btnLast]);

    let sentMessage;

    try {
      sentMessage = await message.reply({ embeds: [pages[index]], components: [actionRow] });
    } catch (error) {
      return msgErrorHandler(error);
    }

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time,
    });

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await btnInteraction.reply({ content: "This button isn't for you!", flags: MessageFlags.Ephemeral });
        } catch (error) {
          return msgErrorHandler(error);
        }
      }

      switch (btnInteraction.customId) {
        case `btn-${commandName}-pageFirst`:
          index = 0;
          btnPageCount.setLabel(`${index + 1}/${pages.length}`);
          break;

        case `btn-${commandName}-pagePrev`:
          if (index > 0) index--;
          btnPageCount.setLabel(`${index + 1}/${pages.length}`);
          break;

        case `btn-${commandName}-pageNext`:
          if (index < pages.length + 1) {
            index++;
            btnPageCount.setLabel(`${index + 1}/${pages.length}`);
          }
          break;

        case `btn-${commandName}-pageLast`:
          index = pages.length - 1;
          btnPageCount.setLabel(`${index + 1}/${pages.length}`);
          break;

        // eh?
        default:
          break;
      }

      if (index === 0) {
        btnFirst.setDisabled(true);
        btnPrev.setDisabled(true);
      } else {
        btnFirst.setDisabled(false);
        btnPrev.setDisabled(false);
      }

      if (index === pages.length - 1) {
        btnLast.setDisabled(true);
        btnNext.setDisabled(true);
      } else {
        btnLast.setDisabled(false);
        btnNext.setDisabled(false);
      }

      try {
        await btnInteraction.update({ embeds: [pages[index]], components: [actionRow] });
      } catch (error) {
        return msgErrorHandler(error);
      }

      collector.resetTimer();
    });

    collector.on("end", async () => {
      try {
        await sentMessage.edit({ embeds: [pages[index]], components: [] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    });
  } catch (error) {
    logger.error(error);
  }
};
