const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler");

// easy peasy, check if we are stealing the emoji from a msg reply or the message command itself
async function getMsgArgs(replyedMessage, message, args) {
  if (replyedMessage) {
    const emojiMessage = await message.channel.messages.fetch(message.reference.messageId);
    return emojiMessage.content;
  } else {
    return args[0];
  }
}

module.exports = {
  name: "stealemoji",
  description: "Returns the emoji has PNG or GIF",
  async execute(client, message, args) {
    const replyedMessage = message.reference || null;

    const emoji = await getMsgArgs(replyedMessage, message, args);

    if (!emoji) {
      message.reply("Provide an emoji, thanks").catch(msgErrorHandler);
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
      } catch (error) {
        message.reply("Invalid emoji, gib a real one").catch(msgErrorHandler);
        return;
      }

      let emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}`;
      if (animated) {
        emojiUrl += ".gif?quality=lossless";
      } else {
        emojiUrl += ".png?quality=lossless";
      }

      const embed = new EmbedBuilder().setColor(0x33ccff).setTitle(`🤠 Stolen emoji ${emojiName}`).setImage(emojiUrl).setFooter({ text: "Click the image to download" });

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    } else {
      message.reply("You need to provide a message with ONLY the emoji to steal").catch(msgErrorHandler);
    }
  },
};
