const { itemPrices, fishPrices } = require("../config.json");

// given the incoming array of json data, we must assign only the quantity of each item to these arrays (to add a new item just add it here, the price in config and in db)
module.exports = function jsonDataAssociator(dataType, jsonData) {
  const botItems = [
    { id: "1", name: "DiversityGem", displayName: "💎 DiversityGem", price: itemPrices.diversityGemPrice, isSingleItem: true },
    { id: "2", name: "Bitcoin", displayName: "🪙 Bitcoin", price: itemPrices.bitcoinPrice, isSingleItem: false },
    { id: "3", name: "Dogecoin", displayName: "🪙 Dogecoin", price: itemPrices.dogecoinPrice, isSingleItem: false },
    { id: "4", name: "Gun", displayName: "🔫 Gun", price: itemPrices.gunPrice, isSingleItem: true },
    { id: "5", name: "AK-47", displayName: "🔫 AK-47", price: itemPrices.ak47Price, isSingleItem: true },
    { id: "6", name: "Fishing Rod", displayName: "🎣 Fishing Rod", price: itemPrices.fishingRodPrice, isSingleItem: true },
    { id: "7", name: "Banana", displayName: "🍌 Banana", price: itemPrices.bananaPrice, isSingleItem: true },
    { id: "8", name: "Beans", displayName: "🥫 Beans", price: itemPrices.beansPrice, isSingleItem: true },
    { id: "9", name: "Holy Poo", displayName: "💩 Holy Poo", price: itemPrices.holyPooPrice, isSingleItem: true },
    { id: "10", name: "Moacoin", displayName: "🗿 Moacoin", price: itemPrices.moacoinPrice, isSingleItem: false },
    { id: "11", name: "Divcoin", displayName: "🪙 Divcoin", price: itemPrices.divcoinPrice, isSingleItem: false },
    { id: "12", name: "Kar98k Scoped", displayName: "🔫 Kar98k Scoped", price: itemPrices.kar98kPrice, isSingleItem: true },
    { id: "13", name: "Pickaxe", displayName: "⛏️ Pickaxe", price: itemPrices.pickaxePrice, isSingleItem: true },
  ];

  const botFishes = [
    { id: "1", name: "Fish", displayName: "🐟 Fish", price: fishPrices.fishPrice },
    { id: "2", name: "Tropical Fish", displayName: "🐠 Tropical Fish", price: fishPrices.tropicalFishPrice },
    { id: "3", name: "Puffer Fish", displayName: "🐡 Puffer Fish", price: fishPrices.pufferFishPrice },
    { id: "4", name: "Shrimp", displayName: "🦐 Shrimp", price: fishPrices.shrimpPrice },
    { id: "5", name: "Lobster", displayName: "🦞 Lobster", price: fishPrices.lobsterPrice },
    { id: "6", name: "Crab", displayName: "🦀 Crab", price: fishPrices.crabPrice },
    { id: "7", name: "Squid", displayName: "🦑 Squid", price: fishPrices.squidPrice },
    { id: "8", name: "Octopus", displayName: "🐙 Octopus", price: fishPrices.octopusPrice },
    { id: "9", name: "Shark", displayName: "🦈 Shark", price: fishPrices.sharkPrice },
    { id: "10", name: "Whale", displayName: "🐋 Whale", price: fishPrices.whalePrice },
  ];

  switch (dataType) {
    case "items":
      try {
        botItems.map((element) => {
          // must start from index 0 to assign the correct value
          element.quantity = jsonData[element.id - 1].quantity;
        });

        return botItems;
      } catch (error) {
        throw new Error("Error while associating the array, CHECK THE DB DATA", error);
      }

    case "fishes":
      try {
        botFishes.map((element) => {
          // must start from index 0 to assign the correct value
          element.quantity = jsonData[element.id - 1].quantity;
        });

        return botFishes;
      } catch (error) {
        throw new Error("Error while associating the array, CHECK THE DB DATA", error);
      }

    default:
      throw new Error("Invalid provided json data to associate");
  }
};
