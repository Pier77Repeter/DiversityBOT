const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "stealemoji",
  description: "Returns the emoji has PNG or GIF",
  async execute(client, message, args) {
    const replyedMessage = message.reference || null;

    const emoji = await getMsgArgs(replyedMessage);

    try {
      if (!emoji) return await message.reply("Provide an emoji, thanks");
    } catch {
      return;
    }

    const emojiName = emoji[0].split(":")[1];
    let emojiId = null;
    let animated = false;

    if (emoji.startsWith("<") && emoji.endsWith(">")) {
      emojiId = emoji.match(/\d{15,}/g)[0];
      animated = emoji.startsWith("<a:");

      try {
        await axios.get(`https://cdn.discordapp.com/emojis/${emojiId}`);
      } catch {
        try {
          return await message.reply("Invalid emoji, gib a real one");
        } catch {
          return;
        }
      }

      let emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}`;
      if (animated) {
        emojiUrl += ".gif?quality=lossless";
      } else {
        emojiUrl += ".png?quality=lossless";
      }

      const embed = new EmbedBuilder()
        .setColor(0x33ccff)
        .setTitle("🤠 Stolen emoji " + emojiName)
        .setImage(emojiUrl)
        .setFooter({ text: "Click the image to download" });

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    } else {
      try {
        return await message.reply("You need to provide a message with ONLY the emoji to steal");
      } catch {
        return;
      }
    }

    async function getMsgArgs(replyedMessage) {
      if (replyedMessage) {
        const emojiMessage = await message.channel.messages.fetch(message.reference.messageId);
        return emojiMessage.content;
      } else {
        return args[0];
      }
    }
  },
};
