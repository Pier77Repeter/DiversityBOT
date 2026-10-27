const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const manageUserMoney = require("../../utils/manageUserMoney");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");
const msgErrorHandler = require("../../utils/msgErrorHandler");
const jsonDataAssociator = require("../../utils/jsonDataAssociator");

// like d!buy, this function saved lots of S P A C E
async function sellItem(itemType, jsonData, itemId, itemName, itemPrice, isSingleItem, sellQuantity, client, message, embed) {
  itemId = parseInt(itemId) - 1; // index starts from 0

  // can't be less than 0 for sure
  if (jsonData[itemId].quantity === 0) {
    embed.setColor(0xff0000).setTitle("❌ Not Owned").setDescription("You don't have this item / fish");

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    return;
  }

  if (isSingleItem) {
    jsonData[itemId].quantity = 0;
  } else {
    if (jsonData[itemId].quantity < sellQuantity) {
      embed.setColor(0xff0000).setTitle("❌ Can't Sell").setDescription(`You don't have that amount of **${itemName}s**`);

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    jsonData[itemId].quantity = jsonData[itemId].quantity - sellQuantity;
    itemPrice = itemPrice * sellQuantity;
  }

  if ((await dbJsonDataSet(client, message, itemType, jsonData, message.author.id)) === null) return;
  if ((await manageUserMoney(client, message, "+", itemPrice)) === null) return;

  embed.setColor(0x00ff00).setTitle("✅ Sold Successful").setDescription(`You sold ${sellQuantity} ${itemName} for **${itemPrice}$**`);

  message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  return;
}

module.exports = {
  name: "sell",
  description: "Sell an item from the inventory",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    if (!args[0]) {
      embed.setColor(0xff0000).setTitle("❌ Invalid Args").setDescription("Wrong syntax, choose an item you want to sell **d!sell <itemName>**");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const items = await dbJsonDataGet(client, message, "items", message.author.id);
    if (items === null) return;

    const fishes = await dbJsonDataGet(client, message, "fishes", message.author.id);
    if (fishes === null) return;

    const thingToSell = args.join(" ").toLowerCase();
    // if the user han't typed any number at the end he's just selling 1 item
    const quantity = isNaN(parseInt(thingToSell.replace(/^(?:\w+\s+)+(\d+)$/, "$1"))) ? 1 : parseInt(thingToSell.replace(/^(?:\w+\s+)+(\d+)$/, "$1"));
    const nameOfThing = thingToSell.replace(/\s+\d+$/, ""); // to remove the ' <num>'

    const botItems = jsonDataAssociator("items", items);
    const botFishes = jsonDataAssociator("fishes", fishes);

    let foundSomething = false;

    botItems.forEach((item) => {
      if (item.id === nameOfThing || item.name.toLowerCase() === nameOfThing) {
        foundSomething = true;

        sellItem("items", items, item.id, item.displayName, item.price, item.isSingleItem, quantity, client, message, embed);
        return;
      }
    });

    // turns out the thing was an item, useless to continue executing
    if (foundSomething) return;

    botFishes.forEach((fish) => {
      if (fish.id === nameOfThing || fish.name.toLowerCase() === nameOfThing) {
        foundSomething = true;

        sellItem("fishes", fishes, fish.id, fish.displayName, fish.price, fish.isSingleItem, quantity, client, message, embed);
        return;
      }
    });

    if (!foundSomething) {
      embed.setColor(0xff0000).setTitle("❌ Item Not Found").setDescription("Item dosen't exist! Check the name with **d!inv** or **d!bucket** for fishes");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }
  },
};
