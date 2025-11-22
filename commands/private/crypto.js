const { PermissionsBitField } = require("discord.js");
const { itemPrices } = require("../../config.json");
const delay = require("../../utils/delay.js");

module.exports = {
  name: "crypto",
  description: "Change the crypto price in config.json",
  async execute(client, message, args) {
    if (message.author.id !== "724990112030654484") return;

    var sentMessage;

    if (!args[0]) {
      try {
        sentMessage = await message.reply("Please insert the name of crypto: **btc**, **doge**, **moa**, **div**");

        await delay(10000);

        return await sentMessage.delete();
      } catch (error) {
        return;
      }
    }

    if (isNaN(args[1])) {
      try {
        sentMessage = await message.reply("Please insert a valid number");

        await delay(10000);

        return await sentMessage.delete();
      } catch (error) {
        return;
      }
    }

    const cryptoName = args[0].toLowerCase();
    const cryptoPrice = parseInt(args[1]);

    switch (cryptoName) {
      case "btc":
        itemPrices.bitcoinPrice = cryptoPrice;

        try {
          sentMessage = await message.reply("Bitcoin's price is now **" + itemPrices.bitcoinPrice + "$**");

          await delay(10000);

          await sentMessage.delete();
        } catch (error) {
          // continue
        }
        break;

      case "doge":
        itemPrices.dogecoinPrice = cryptoPrice;

        try {
          sentMessage = await message.reply("Dogecoin's price is now **" + itemPrices.dogecoinPrice + "$**");

          await delay(10000);

          await sentMessage.delete();
        } catch (error) {
          // continue
        }
        break;

      case "moa":
        itemPrices.moacoinPrice = cryptoPrice;

        try {
          sentMessage = await message.reply("Moacoin's price is now **" + itemPrices.moacoinPrice + "$**");

          await delay(10000);

          await sentMessage.delete();
        } catch (error) {
          // continue
        }
        break;

      case "div":
        itemPrices.divcoinPrice = cryptoPrice;

        try {
          sentMessage = await message.reply("Moacoin's price is now **" + itemPrices.divcoinPrice + "$**");

          await delay(10000);

          await sentMessage.delete();
        } catch (error) {
          // continue
        }
        break;

      default:
        try {
          sentMessage = await message.reply("Invalid crypto name, chose between: **btc**, **doge**, **moa**, **div**");

          await delay(10000);

          await sentMessage.delete();
        } catch (error) {
          // continue
        }
        break;
    }

    // this at the end
    if (message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageMessages)) {
      try {
        return await message.delete();
      } catch (error) {
        return;
      }
    }
  },
};
