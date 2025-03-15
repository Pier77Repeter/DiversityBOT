const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "stealemoji",
  description: "Returns the emoji has PNG or GIF",
  async execute(client, message, args) {
    var emoji = args[0];

    if (!emoji) {
      try {
        return await message.reply("Provide an emoji, thanks");
      } catch (error) {
        return;
      }
    }

    const emojiName = args[0].split(":")[1];
    let emojiId = null;
    let animated = false;

    if (emoji.startsWith("<") && emoji.endsWith(">")) {
      emojiId = emoji.match(/\d{15,}/g)[0];
      animated = emoji.startsWith("<a:");

      try {
        await axios.get(`https://cdn.discordapp.com/emojis/${emojiId}`);
      } catch (err) {
        try {
          return await message.reply("Invalid emoji, gib a real one");
        } catch (error) {
          return;
        }
      }

      let emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}`;
      if (animated) {
        emojiUrl += ".gif?quality=lossless";
      } else {
        emojiUrl += ".png?quality=lossless";
      }

      const emojistealMessageEmbed = new EmbedBuilder()
        .setColor(0x33ccff)
        .setTitle("Stealed emoji: " + emojiName)
        .setImage(emojiUrl)
        .setFooter({ text: "Click the image to download" });

      try {
        return await message.reply({ embeds: [emojistealMessageEmbed] });
      } catch (error) {
        return;
      }
    } else {
      try {
        return await message.reply("that is not an emoji bruh");
      } catch (error) {
        return;
      }
    }
  },
};
