const { EmbedBuilder } = require("discord.js");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const delay = require("./../../utils/delay");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "use",
  description: "Use command, can display list of items or use",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();
    const itemToUse = args[0];

    if (!itemToUse) {
      embed.setColor(0xff6600).setTitle("Here is the list of usable items").setDescription(["d!use banana", "d!use beans", "d!use poo <@user>"].join("\n"));

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const items = await dbJsonDataGet(client, message, "items", message.author.id);
    if (items === null) return;

    switch (itemToUse.toLowerCase()) {
      case "banana":
        if (items[6].quantity === 0) {
          embed.setColor(0xff0000).setTitle("❌ Missing Item").setDescription("You don't have a banana, buy it!");

          message.reply({ embeds: [embed] }).catch(msgErrorHandler);
          return;
        }

        items[6].quantity = 0;

        if ((await dbJsonDataSet(client, message, "items", items, message.author.id)) === null) return;

        embed.setColor(0xffcc00).setTitle("Delicious").setDescription("You ate the banana! 🍌🍌🍌");

        message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        return;

      case "beans":
        if (items[7].quantity === 0) {
          embed.setColor(0xff0000).setTitle("❌ Missing Item").setDescription("You don't have beans, buy them!");

          message.reply({ embeds: [embed] }).catch(msgErrorHandler);
          return;
        }

        items[7].quantity = 0;

        if ((await dbJsonDataSet(client, message, "items", items, message.author.id)) === null) return;

        embed.setColor(0xffcc00).setTitle("Delicious").setDescription("You ate the beans! 🥫🥫🥫");

        const sentMessage = await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        if (!sentMessage) return;

        await delay(3000);

        embed.setColor(0x000000).setTitle("And...").setDescription(null);

        try {
          await sentMessage.edit({ embeds: [embed] });
        } catch (error) {
          return msgErrorHandler(error);
        }

        await delay(2000);

        embed.setColor(0x33ff33).setTitle("💨💨💨 You Farted!");

        sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);
        return;

      case "poo":
        if (items[8].quantity === 0) {
          embed.setColor(0xff0000).setTitle("❌ Missing Item").setDescription("You don't have poo, b-..buy it?");

          message.reply({ embeds: [embed] }).catch(msgErrorHandler);
          return;
        }

        if (!message.mentions.members.first()) {
          message.reply("Mention your victim before using the poo").catch(msgErrorHandler);
          return;
        }

        items[8].quantity = 0;

        if ((await dbJsonDataSet(client, message, "items", items, message.author.id)) === null) return;

        embed.setColor(0x0ffcc00).setTitle("You trow the poo 💩").setDescription(`${message.mentions.members.first().user.username} is ded! HA! HA! HA!`);

        message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        return;

      default:
        embed.setColor(0xff0000).setTitle("❌ Not Found").setDescription("That items dosen't exist, type **d!use** to see the list");

        message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        return;
    }
  },
};
