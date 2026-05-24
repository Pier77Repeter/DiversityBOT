const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const manageUserMoney = require("../../utils/manageUserMoney");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");
const { itemPrices, fishPrices } = require("../../config.json");

module.exports = {
  name: "sell",
  description: "Sell an item from the inventory",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    if (!args[0]) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Wrong syntax, choose an item you want to sell **d!sell <itemName>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const items = await dbJsonDataGet(client, message.author, message, "items");
    if (items === null) return;

    const fishes = await dbJsonDataGet(client, message.author, message, "fishes");
    if (fishes === null) return;

    switch (args.join(" ").toLowerCase()) {
      case "diversitygem":
        return await sellItem("items", items, "itemId1", "DiversityGem", itemPrices.diversityGemPrice, true);

      case "bitcoin":
        return await sellItem("items", items, "itemId2", "Bitcoin", itemPrices.bitcoinPrice, false);

      case "dogecoin":
        return await sellItem("items", items, "itemId3", "Dogecoin", itemPrices.dogecoinPrice, false);

      case "gun":
        return await sellItem("items", items, "itemId4", "Gun", itemPrices.gunPrice, true);

      case "ak-47":
        return await sellItem("items", items, "itemId5", "AK-47", itemPrices.ak47Price, true);

      case "fishing rod":
        return await sellItem("items", items, "itemId6", "Fishing Rod", itemPrices.fishingRodPrice, true);

      case "banana":
        return await sellItem("items", items, "itemId7", "Banana", itemPrices.bananaPrice, true);

      case "beans":
        return await sellItem("items", items, "itemId8", "Beans", itemPrices.beansPrice, true);

      case "holy poo":
        return await sellItem("items", items, "itemId9", "Holy Poo", itemPrices.holyPooPrice, true);

      case "moacoin":
        return await sellItem("items", items, "itemId10", "Moacoin", itemPrices.moacoinPrice, false);

      case "divcoin":
        return await sellItem("items", items, "itemId11", "Divcoin", itemPrices.divcoinPrice, false);

      case "kar98k scoped":
        return await sellItem("items", items, "itemId12", "Kar98k-Scoped", itemPrices.kar98kPrice, true);

      case "pickaxe":
        return await sellItem("items", items, "itemId13", "Pickaxe", itemPrices.pickaxePrice, true);

      // fish section
      case "fish":
        return await sellItem("fishes", fishes, "fishId1", "Classic Fish", fishPrices.fishPrice, false);

      case "tropical fish":
        return await sellItem("fishes", fishes, "fishId2", "Tropical Fish", fishPrices.tropicalFishPrice, false);

      case "blowfish":
        return await sellItem("fishes", fishes, "fishId3", "Puffer Fish", fishPrices.pufferFishPrice, false);

      case "shrimp":
        return await sellItem("fishes", fishes, "fishId4", "Shrimp", fishPrices.shrimpPrice, false);

      case "lobster":
        return await sellItem("fishes", fishes, "fishId5", "Lobster", fishPrices.lobsterPrice, false);

      case "crab":
        return await sellItem("fishes", fishes, "fishId6", "Crab", fishPrices.crabPrice, false);

      case "squid":
        return await sellItem("fishes", fishes, "fishId7", "Squid", fishPrices.squidPrice, false);

      case "octopus":
        return await sellItem("fishes", fishes, "fishId8", "Octopus", fishPrices.octopusPrice, false);

      case "shark":
        return await sellItem("fishes", fishes, "fishId9", "Shark", fishPrices.sharkPrice, false);

      case "whale":
        return await sellItem("fishes", fishes, "fishId10", "Whale", fishPrices.whalePrice, false);

      default:
        embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Item dosen't exist! You can only sell items or fishes by name like **d!sell fishing rod**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch {
          return;
        }
        break;
    }

    // like d!buy, this function saved lots of S P A C E
    async function sellItem(itemType, jsonData, itemId, itemName, itemPrice, isSingleItem) {
      if (!jsonData[itemId]) {
        embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

        try {
          return await message.reply({ embeds: [embed] });
        } catch {
          return;
        }
      }

      if (isSingleItem) {
        jsonData[itemId] = false;
      }

      if (!isSingleItem && jsonData[itemId + "Count"] - 1 === 0) {
        jsonData[itemId] = false;
      } else if (!isSingleItem) {
        jsonData[itemId + "Count"]--;
      }

      if ((await dbJsonDataSet(client, message, itemType, jsonData)) === null) return;
      if ((await manageUserMoney(client, message, "+", itemPrice)) === null) return;

      embed.setColor(0x00ff00).setTitle("✅ Sold successful").setDescription(`You sold the ${itemName} for **${itemPrice}$**`);

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }
  },
};
