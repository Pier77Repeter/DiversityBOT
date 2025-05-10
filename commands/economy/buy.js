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
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Wrong syntax, choose an item you want to buy **d!buy <itemName>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const items = await dbJsonDataGet(client, message.author, message, "items");
    if (items == null) return;

    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT money FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, message.author.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!row) {
      try {
        return await message.reply("Failed to get your money");
      } catch (error) {
        return;
      }
    }

    switch (args[0].toLowerCase()) {
      case "diversitygem":
        if (items.itemId1) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You already own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (row.money < itemPrices.diversityGemPrice) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId1 = true;

        // take a look into dbJsonDataSet, it replys and returns null if shit goes wrong
        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        // look this too, used only to update message.auhtor's money
        if ((await manageUserMoney(client, message, "-", itemPrices.diversityGemPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Purchase successful")
          .setDescription("You bought a **DiversityGem** for **" + itemPrices.diversityGemPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "bitcoin":
        if (row.money < itemPrices.bitcoinPrice) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (!items.itemId2) {
          items.itemId2 = true;
        }

        items.itemId2Count++;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "-", itemPrices.bitcoinPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Purchase successful")
          .setDescription("You bought a **bitcoin** for **" + itemPrices.bitcoinPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "dogecoin":
        if (row.money < itemPrices.dogecoinPrice) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (!items.itemId3) {
          items.itemId3 = true;
        }

        items.itemId3Count++;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "-", itemPrices.dogecoinPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Purchase successful")
          .setDescription("You bought a **dogecoin** for **" + itemPrices.dogecoinPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "gun":
        if (items.itemId4) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You already own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (row.money < itemPrices.gunPrice) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId4 = true;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "-", itemPrices.gunPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Purchase successful")
          .setDescription("You bought a **gun** for **" + itemPrices.gunPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "ak-47":
        if (items.itemId5) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You already own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (row.money < itemPrices.ak47Price) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId5 = true;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "-", itemPrices.ak47Price)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Purchase successful")
          .setDescription("You bought an **AK-47** for **" + itemPrices.ak47Price + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "fishing rod":
        if (items.itemId6) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You already own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (row.money < itemPrices.fishingRodPrice) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId6 = true;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "-", itemPrices.ak47Price)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Purchase successful")
          .setDescription("You bought a **fishing rod** for **" + itemPrices.ak47Price + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "banana":
        if (items.itemId7) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You already own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (row.money < itemPrices.bananaPrice) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId7 = true;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "-", itemPrices.bananaPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Purchase successful")
          .setDescription("You bought a **banana** for **" + itemPrices.bananaPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "beans":
        if (items.itemId8) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You already own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (row.money < itemPrices.beansPrice) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId8 = true;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "-", itemPrices.beansPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Purchase successful")
          .setDescription("You bought **beans** for **" + itemPrices.beansPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "holy poo":
        if (items.itemId9) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You already own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (row.money < itemPrices.holyPooPrice) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId9 = true;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "-", itemPrices.holyPooPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Purchase successful")
          .setDescription("You bought the **holy poo** for **" + itemPrices.holyPooPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "moacoin":
        if (row.money < itemPrices.moacoinPrice) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (!items.itemId10) {
          items.itemId10 = true;
        }

        items.itemId10Count++;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "-", itemPrices.moacoinPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Purchase successful")
          .setDescription("You bought a **moacoin** for **" + itemPrices.moacoinPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "divcoin":
        if (row.money < itemPrices.divcoinPrice) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (!items.itemId11) {
          items.itemId11 = true;
        }

        items.itemId11Count++;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "-", itemPrices.divcoinPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Purchase successful")
          .setDescription("You bought a **divcoin** for **" + itemPrices.divcoinPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "kar98k scoped":
        if (items.itemId12) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You already own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (row.money < itemPrices.kar98kPrice) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId12 = true;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "-", itemPrices.kar98kPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Purchase successful")
          .setDescription("You bought a **kar98k scoped** for **" + itemPrices.kar98kPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "pickaxe":
        if (items.itemId13) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You already own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (row.money < itemPrices.pickaxePrice) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money to buy this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId13 = true;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "-", itemPrices.pickaxePrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Purchase successful")
          .setDescription("You bought **pickaxe** for **" + itemPrices.pickaxePrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      default:
        embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Items dosen't exist in the store");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }
    }
  },
};
