const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const manageUserMoney = require("../../utils/manageUserMoney");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");
const { itemPrices } = require("../../config.json");

module.exports = {
  name: "buy",
  description: "Buy an item from the store",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    if (!args[0]) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Wrong syntax, choose the item you want to buy **d!buy <itemName>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const items = await dbJsonDataGet(client, message.author, message, "items");
    if (items === null) return;

    const row = await client.database.query("SELECT money FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

    // this shouldn't happen since data is created before command gets executed, still wise to have this
    if (row.rowCount === 0) {
      throw new Error(
        ["The record 'money' was NOT found in the database, CHECK THE QUERY", "Requested from Server: '" + message.guildId + "' - User: '" + message.author.id + "'"].join("\n"),
      );
    }

    switch (args.join(" ").toLowerCase()) {
      case "diversitygem":
        // magnificent function
        return await buyItem(itemPrices.diversityGemPrice, "itemId1", "DiversityGem", false);

      case "bitcoin":
        return await buyItem(itemPrices.bitcoinPrice, "itemId2", "Bitcoin", true);

      case "dogecoin":
        return await buyItem(itemPrices.dogecoinPrice, "itemId3", "Dogecoin", true);

      case "gun":
        return await buyItem(itemPrices.gunPrice, "itemId4", "Gun", false);

      case "ak-47":
        return await buyItem(itemPrices.ak47Price, "itemId5", "AK-47", false);

      case "fishing rod":
        return await buyItem(itemPrices.fishingRodPrice, "itemId6", "Fishing Rod", false);

      case "banana":
        return await buyItem(itemPrices.bananaPrice, "itemId7", "Banana", false);

      case "beans":
        return await buyItem(itemPrices.beansPrice, "itemId8", "Beans", false);

      case "holy poo":
        return await buyItem(itemPrices.holyPooPrice, "itemId9", "Holy Poo", false);

      case "moacoin":
        return await buyItem(itemPrices.moacoinPrice, "itemId10", "Moacoin", true);

      case "divcoin":
        return await buyItem(itemPrices.divcoinPrice, "itemId11", "Divcoin", true);

      case "kar98k scoped":
        return await buyItem(itemPrices.kar98kPrice, "itemId12", "Kar98k Scoped", false);

      case "pickaxe":
        return await buyItem(itemPrices.pickaxePrice, "itemId13", "Pickaxe", false);

      default:
        embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Item dosen't exist! You can only buy items by name like **d!buy fishing rod**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch {
          return;
        }

        async function buyItem(itemCost, itemId, itemName, canBuyMultiple) {
          if (items[itemId] && canBuyMultiple) {
            embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You already own this item");

            try {
              return await message.reply({ embeds: [embed] });
            } catch {
              return;
            }
          }

          if (row.rows[0].money < itemPrices[itemId]) {
            embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

            try {
              return await message.reply({ embeds: [embed] });
            } catch {
              return;
            }
          }

          items[itemId] = true;
          if (canBuyMultiple) items[itemId + "Count"]++;

          if ((await dbJsonDataSet(client, message, "items", items)) === null) return;
          if ((await manageUserMoney(client, message, "-", itemCost)) === null) return;

          embed.setColor(0x00ff00).setTitle("✅ Purchase successful").setDescription(`You bought a **${itemName}** for **${itemCost}$**`);

          try {
            return await message.reply({ embeds: [embed] });
          } catch {
            return;
          }
        }
    }
  },
};
