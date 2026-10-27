const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const msgErrorHandler = require("../../utils/msgErrorHandler");
const embedPaginator = require("../../utils/embedPaginator");

module.exports = {
  name: "urban",
  description: "Searches the given data in the urban dictionary",
  async execute(client, message, args) {
    const searchTerm = args.join(" ");

    if (!searchTerm) {
      message.reply("Please provide a search term").catch(msgErrorHandler);
      return;
    }

    let response;

    try {
      response = await axios.get("https://api.urbandictionary.com/v0/define?term=" + encodeURIComponent(searchTerm));
    } catch (error) {
      message.reply("O_o, something went wrong while searching in the dictionary").catch(msgErrorHandler);
      return;
    }

    if (!response.data.list || response.data.list.length === 0) {
      message.reply(`No definitions found for "${searchTerm}"`).catch(msgErrorHandler);
      return;
    }

    const definitions = response.data.list;
    const embeds = [];

    for (let index = 0; index < definitions.length; index++) {
      const MAX_DESCRIPTION_LENGTH = 1024;
      let description = definitions[index].definition.replace(/[\[\]]/g, ""); // remove brackets, see the API response

      if (description.length > MAX_DESCRIPTION_LENGTH) {
        description = description.substring(0, MAX_DESCRIPTION_LENGTH - 3) + "...";
      }

      const MAX_EXAMPLE_LENGTH = 1024;
      let example = definitions[index].example.replace(/[\[\]]/g, "");

      if (example.length > MAX_EXAMPLE_LENGTH) {
        example = example.substring(0, MAX_EXAMPLE_LENGTH - 3) + "...";
      }

      embeds.push(
        new EmbedBuilder()
          .setColor(0x668baf)
          .setTitle(`Definition of: ${definitions[index].word}`)
          .setURL(definitions[index].permalink)
          .setDescription(description)
          .addFields(
            { name: "Example", value: example },
            { name: "Author", value: definitions[index].author, inline: true },
            {
              name: "Votes",
              value: `👍 ${definitions[index].thumbs_up} - 👎 ${definitions[index].thumbs_down}`,
            },
          )
          .setFooter({ text: `Pages ${index + 1} of ${definitions.length}` }),
      );
    }

    embedPaginator(this.name, message, embeds).catch(msgErrorHandler);
  },
};
