const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "urban",
  description: "Searches the given data in the urban dictionary",
  async execute(client, message, args) {
    const searchTerm = args.join(" ");

    if (!searchTerm) {
      try {
        return await message.reply("Please provide a search term.");
      } catch (error) {
        return;
      }
    }

    var response;
    try {
      response = await axios.get("https://api.urbandictionary.com/v0/define?term=" + encodeURIComponent(searchTerm));
    } catch (error) {
      try {
        return await message.reply("O_o, something went wrong while searching in the dictionary");
      } catch (error) {
        return;
      }
    }

    if (!response.data.list || response.data.list.length === 0) {
      try {
        return await message.reply(`No definitions found for "${searchTerm}"`);
      } catch (error) {
        return;
      }
    }

    const definitions = response.data.list;
    var currentIndex = 0;

    // create an embed for a specific definition
    const createDefinitionEmbed = (definition, index, total) => {
      const MAX_DESCRIPTION_LENGTH = 1024;
      var description = definition.definition.replace(/[\[\]]/g, ""); // remove brackets

      if (description.length > MAX_DESCRIPTION_LENGTH) {
        description = description.substring(0, MAX_DESCRIPTION_LENGTH - 3) + "...";
      }

      const MAX_EXAMPLE_LENGTH = 1024;
      var example = definition.example.replace(/[\[\]]/g, "");

      if (example.length > MAX_EXAMPLE_LENGTH) {
        example = example.substring(0, MAX_EXAMPLE_LENGTH - 3) + "...";
      }

      return new EmbedBuilder()
        .setTitle("Definition of: " + definition.word)
        .setURL(definition.permalink)
        .setDescription(description)
        .addFields(
          { name: "Example", value: example },
          { name: "Author", value: definition.author, inline: true },
          {
            name: "Votes",
            value: "👍 " + definition.thumbs_up.toString() + " - 👎 " + definition.thumbs_down.toString(),
          }
        )
        .setFooter({ text: `Pages ${index + 1} of ${total}` });
    };

    // init embed
    const urbanMessageEmbed = createDefinitionEmbed(definitions[currentIndex], currentIndex, definitions.length);

    const prevBtn = new ButtonBuilder()
      .setCustomId("btn-urban-prevBbtn")
      .setLabel("Previous")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentIndex === 0);

    const nextBtn = new ButtonBuilder()
      .setCustomId("btn-urban-nextBtn")
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentIndex === definitions.length - 1);

    const btnRow = new ActionRowBuilder().addComponents(prevBtn, nextBtn);

    var sentMessage;
    try {
      sentMessage = await message.reply({ embeds: [urbanMessageEmbed], components: [btnRow] });
    } catch (error) {
      return;
    }

    const btnCollector = sentMessage.createMessageComponentCollector({
      time: 60_000,
    });

    btnCollector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await btnInteraction.reply({
            content: "Don't bother this user's command, type d!urban to search for yourself",
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          return;
        }
      }

      switch (btnInteraction.customId) {
        case "btn-urban-prevBbtn":
          btnCollector.resetTimer();
          currentIndex--;
          break;

        case "btn-urban-nextBtn":
          btnCollector.resetTimer();
          currentIndex++;
          break;
      }

      // updating button states
      prevBtn.setDisabled(currentIndex === 0);
      nextBtn.setDisabled(currentIndex === definitions.length - 1);

      const updatedUrbanMessageEmbed = createDefinitionEmbed(definitions[currentIndex], currentIndex, definitions.length);
      try {
        await btnInteraction.update({ embeds: [updatedUrbanMessageEmbed], components: [btnRow] });
      } catch (error) {
        return;
      }
    });

    btnCollector.on("end", async () => {
      prevBtn.setDisabled(true);
      nextBtn.setDisabled(true);

      try {
        return await sentMessage.edit({ components: [btnRow] });
      } catch (error) {
        return;
      }
    });
  },
};
