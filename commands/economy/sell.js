const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const manageUserMoney = require("../../utils/manageUserMoney");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");
const msgErrorHandler = require("../../utils/msgErrorHandler");
const jsonDataAssociator = require("../../utils/jsonDataAssociator");

module.exports = {
  name: "sell",
  description: "Sell an item from the inventory",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    if (!args[0]) {
      embed.setColor(0xff0000).setTitle("❌ Invalid Args").setDescription("Wrong syntax, choose an item you want to sell **d!sell <itemName>**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const items = await dbJsonDataGet(client, message, "items", message.author.id);
    if (items === null) return;

    const fishes = await dbJsonDataGet(client, message, "fishes", message.author.id);
    if (fishes === null) return;

    const thingToSell = args.join(" ").toLowerCase();

    const botItems = jsonDataAssociator("items", items);
    const botFishes = jsonDataAssociator("fishes", fishes);

    let foundSomething = false;

    botItems.forEach((item) => {
      if (item.id === thingToSell || item.name.toLowerCase() === thingToSell) {
        foundSomething = true;
        return sellItem("items", items, item.id, item.displayName, item.price, item.isSingleItem);
      }
    });

    botFishes.forEach((fish) => {
      if (fish.id === thingToSell || fish.name.toLowerCase() === thingToSell) {
        foundSomething = true;
        return sellItem("fishes", fishes, fish.id, fish.displayName, fish.price, fish.isSingleItem);
      }
    });

    if (!foundSomething) {
      embed.setColor(0xff0000).setTitle("❌ Item Not Found").setDescription("Item dosen't exist! You can only sell items or fishes by name like **d!sell fishing rod**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    // like d!buy, this function saved lots of S P A C E
    async function sellItem(itemType, jsonData, itemId, itemName, itemPrice, isSingleItem) {
      itemId = parseInt(itemId) - 1; // index starts from 0

      // can't be less than 0 for sure
      if (jsonData[itemId].quantity === 0) {
        embed.setColor(0xff0000).setTitle("❌ Not Owned").setDescription("You don't have this item");
        return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      }

      if (isSingleItem) {
        jsonData[itemId].quantity = 0;
      } else {
        jsonData[itemId].quantity--;
      }

      if ((await dbJsonDataSet(client, message, itemType, jsonData, message.author.id)) === null) return;
      if ((await manageUserMoney(client, message, "+", itemPrice)) === null) return;

      embed.setColor(0x00ff00).setTitle("✅ Sold Successful").setDescription(`You sold the ${itemName} for **${itemPrice}$**`);

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }
  },
};
