const { PermissionsBitField } = require("discord.js");
const { itemPrices } = require("../../config.json");
const delay = require("../../utils/delay.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");

module.exports = {
  name: "crypto",
  description: "Change the crypto price in config.json",
  async execute(client, message, args) {
    if (message.author.id !== "724990112030654484") return;

    let sentMessage;

    if (!args[0]) {
      sentMessage = await message.reply("Please insert the name of crypto: **btc**, **doge**, **moa**, **div**").catch(msgErrorHandler);

      await delay(10000);

      return await sentMessage.delete().catch(msgErrorHandler);
    }

    if (isNaN(args[1])) {
      sentMessage = await message.reply("Please insert a valid number").catch(msgErrorHandler);

      await delay(10000);

      return await sentMessage.delete().catch(msgErrorHandler);
    }

    const cryptoName = args[0].toLowerCase();
    const cryptoPrice = parseInt(args[1]);

    switch (cryptoName) {
      case "btc":
        itemPrices.bitcoinPrice = cryptoPrice;

        sentMessage = await message.reply("Bitcoin's price is now **" + itemPrices.bitcoinPrice + "$**").catch(msgErrorHandler);

        await delay(10000);

        await sentMessage.delete().catch(msgErrorHandler);
        break;

      case "doge":
        itemPrices.dogecoinPrice = cryptoPrice;

        sentMessage = await message.reply("Dogecoin's price is now **" + itemPrices.dogecoinPrice + "$**").catch(msgErrorHandler);

        await delay(10000);

        await sentMessage.delete().catch(msgErrorHandler);
        break;

      case "moa":
        itemPrices.moacoinPrice = cryptoPrice;

        sentMessage = await message.reply("Moacoin's price is now **" + itemPrices.moacoinPrice + "$**").catch(msgErrorHandler);

        await delay(10000);

        await sentMessage.delete().catch(msgErrorHandler);
        break;

      case "div":
        itemPrices.divcoinPrice = cryptoPrice;

        sentMessage = await message.reply("Moacoin's price is now **" + itemPrices.divcoinPrice + "$**").catch(msgErrorHandler);

        await delay(10000);

        await sentMessage.delete().catch(msgErrorHandler);
        break;

      default:
        sentMessage = await message.reply("Invalid crypto name, chose between: **btc**, **doge**, **moa**, **div**").catch(msgErrorHandler);

        await delay(10000);

        await sentMessage.delete().catch(msgErrorHandler);
        break;
    }

    // this at the end
    if (message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageMessages)) {
      return await message.delete().catch(msgErrorHandler);
    }
  },
};
