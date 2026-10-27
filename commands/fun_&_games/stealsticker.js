const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "stealsticker",
  description: "Steal a sticker from chat",
  async execute(client, message, args) {
    const replyedMessage = message.reference || null;

    if (!replyedMessage) {
      message.reply("Reply to a message containing a sticker").catch(msgErrorHandler);
      return;
    }

    const stickerMessage = await message.channel.messages.fetch(message.reference.messageId);
    const sticker = stickerMessage.stickers.first();

    if (!sticker) {
      message.reply("No snicker has been found in that message").catch(msgErrorHandler);
      return;
    }

    if (sticker.url.endsWith(".json")) {
      message.reply("I can not steal Discord's official stickers").catch(msgErrorHandler);
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x33ccff)
      .setTitle(`🤠 Stolen sticker ${sticker.name}`)
      .setImage(sticker.url)
      .setFooter({ text: "Click the image to download" });

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
