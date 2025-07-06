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
      } catch (error) {
        return;
      }
    }

    const items = await dbJsonDataGet(client, message.author, message, "items");
    if (items == null) return;

    const fishes = await dbJsonDataGet(client, message.author, message, "fishes");
    if (fishes == null) return;

    switch (args[0].toLowerCase()) {
      case "diversitygem":
        if (!items.itemId1) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId1 = false;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "+", itemPrices.diversityGemPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold the **DiversityGem** for **" + itemPrices.diversityGemPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "bitcoin":
        if (!items.itemId2) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId2Count--;

        if (items.itemId2Count < 1) {
          items.itemId2 = false;
        }

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "+", itemPrices.bitcoinPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **bitcoin** for **" + itemPrices.bitcoinPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "dogecoin":
        if (!items.itemId3) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId3Count--;

        if (items.itemId3Count < 1) {
          items.itemId3 = false;
        }

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "+", itemPrices.dogecoinPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **dogecoin** for **" + itemPrices.dogecoinPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "gun":
        if (!items.itemId4) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId4 = false;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "+", itemPrices.gunPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **gun** for **" + itemPrices.gunPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "ak-47":
        if (!items.itemId5) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId5 = false;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "+", itemPrices.ak47Price)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold an **AK-47** for **" + itemPrices.ak47Price + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "fishing rod":
        if (!items.itemId6) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId6 = false;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "+", itemPrices.fishingRodPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **fishing rod** for **" + itemPrices.fishingRodPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "banana":
        if (!items.itemId7) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId7 = false;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "+", itemPrices.bananaPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **banana** for **" + itemPrices.bananaPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "beans":
        if (!items.itemId8) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId8 = false;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "+", itemPrices.beansPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold **beans** for **" + itemPrices.beansPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "holy poo":
        if (!items.itemId9) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId9 = false;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "+", itemPrices.holyPooPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold the **holy poo** for **" + itemPrices.holyPooPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "moacoin":
        if (!items.itemId10) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId10Count--;

        if (items.itemId10Count < 1) {
          items.itemId10 = false;
        }

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "+", itemPrices.moacoinPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **moacoin** for **" + itemPrices.moacoinPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "divcoin":
        if (!items.itemId11) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId11Count--;

        if (items.itemId11Count < 1) {
          items.itemId11 = false;
        }

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "+", itemPrices.divcoinPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **divcoin** for **" + itemPrices.divcoinPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "kar98k scoped":
        if (!items.itemId12) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId12 = false;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "+", itemPrices.kar98kPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **Kar98k scoped** for **" + itemPrices.kar98kPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "pickaxe":
        if (!items.itemId13) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't own this item");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId13 = false;

        if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
        if ((await manageUserMoney(client, message, "+", itemPrices.pickaxePrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **pickaxe** for **" + itemPrices.pickaxePrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      // fish section
      case "fish":
        if (!fishes.fishId1) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have this fish");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        fishes.fishId1Count--;

        if (fishes.fishId1Count < 1) {
          fishes.fishId1 = false;
        }

        if ((await dbJsonDataSet(client, message, "fishes", fishes)) == null) return;
        if ((await manageUserMoney(client, message, "+", fishPrices.fishPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **fish** for **" + fishPrices.fishPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }
      case "tropical fish":
        if (!fishes.fishId2) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have this fish");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        fishes.fishId2Count--;

        if (fishes.fishId2Count < 1) {
          fishes.fishId2 = false;
        }

        if ((await dbJsonDataSet(client, message, "fishes", fishes)) == null) return;
        if ((await manageUserMoney(client, message, "+", fishPrices.tropicalFishPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **tropical fish** for **" + fishPrices.tropicalFishPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }
      case "blowfish":
        if (!fishes.fishId3) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have this fish");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        fishes.fishId3Count--;

        if (fishes.fishId3Count < 1) {
          fishes.fishId3 = false;
        }

        if ((await dbJsonDataSet(client, message, "fishes", fishes)) == null) return;
        if ((await manageUserMoney(client, message, "+", fishPrices.pufferFishPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **puffer fish** for **" + fishPrices.pufferFishPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "shrimp":
        if (!fishes.fishId4) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have this fish");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        fishes.fishId4Count--;

        if (fishes.fishId4Count < 1) {
          fishes.fishId4 = false;
        }

        if ((await dbJsonDataSet(client, message, "fishes", fishes)) == null) return;
        if ((await manageUserMoney(client, message, "+", fishPrices.shrimpPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **shrimp** for **" + fishPrices.shrimpPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "lobster":
        if (!fishes.fishId5) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have this fish");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        fishes.fishId5Count--;

        if (fishes.fishId5Count < 1) {
          fishes.fishId5 = false;
        }

        if ((await dbJsonDataSet(client, message, "fishes", fishes)) == null) return;
        if ((await manageUserMoney(client, message, "+", fishPrices.lobsterPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **lobster** for **" + fishPrices.lobsterPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "crab":
        if (!fishes.fishId6) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have this fish");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        fishes.fishId6Count--;

        if (fishes.fishId6Count < 1) {
          fishes.fishId6 = false;
        }

        if ((await dbJsonDataSet(client, message, "fishes", fishes)) == null) return;
        if ((await manageUserMoney(client, message, "+", fishPrices.crabPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **crab** for **" + fishPrices.crabPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "squid":
        if (!fishes.fishId7) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have this fish");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        fishes.fishId7Count--;

        if (fishes.fishId7Count < 1) {
          fishes.fishId7 = false;
        }

        if ((await dbJsonDataSet(client, message, "fishes", fishes)) == null) return;
        if ((await manageUserMoney(client, message, "+", fishPrices.squidPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **squid** for **" + fishPrices.squidPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "octopus":
        if (!fishes.fishId8) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have this fish");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        fishes.fishId8Count--;

        if (fishes.fishId8Count < 1) {
          fishes.fishId8 = false;
        }

        if ((await dbJsonDataSet(client, message, "fishes", fishes)) == null) return;
        if ((await manageUserMoney(client, message, "+", fishPrices.octopusPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold an **octopus** for **" + fishPrices.octopusPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "shark":
        if (!fishes.fishId9) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have this fish");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        fishes.fishId9Count--;

        if (fishes.fishId9Count < 1) {
          fishes.fishId9 = false;
        }

        if ((await dbJsonDataSet(client, message, "fishes", fishes)) == null) return;
        if ((await manageUserMoney(client, message, "+", fishPrices.sharkPrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **shark** for **" + fishPrices.sharkPrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "whale":
        if (!fishes.fishId10) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have this fish");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        fishes.fishId10Count--;

        if (fishes.fishId10Count < 1) {
          fishes.fishId10 = false;
        }

        if ((await dbJsonDataSet(client, message, "fishes", fishes)) == null) return;
        if ((await manageUserMoney(client, message, "+", fishPrices.whalePrice)) == null) return;

        embed
          .setColor(0x00ff00)
          .setTitle("✅ Sold successful")
          .setDescription("You sold a **whale** for **" + fishPrices.whalePrice + "$**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      default:
        embed.setColor(0xff0000).setTitle("❌ Error").setDescription("That thing you trying to sell dosen't exist");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }
    }
  },
};
