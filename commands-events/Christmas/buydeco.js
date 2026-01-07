const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "buydeco",
  description: "Buy decorations for the christmas tree from the decoshop",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isEventEnabled = await configChecker(client, message, "eventCmd");
    if (isEventEnabled == null) return;

    if (!isEventEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Event commands are off! Type **d!setup event** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT treeLevel, goldenCoins FROM Event WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Failed to load your materials list from the database");
      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (row.treeLevel != 5) {
      embed.setColor(0xff0000).setTitle("❌ Not yet").setDescription("You need to upgrade your Christmas tree to **level 5** to unlock the decorations");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const deco = args.join(" ").toLowerCase();

    switch (deco) {
      case "christmas star":
        if (row.goldenCoins < 300) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Not enough **🪙 golden coins** to buy the **Christmas star** (cost: 300 🪙)");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE Event SET goldenCoins = goldenCoins - 300, decoId1 = 1 WHERE serverId = ? AND userId = ?",
            [message.guild.id, message.author.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        embed.setColor(0x00ff00).setTitle("✅ Success").setDescription("You have bought the **Christmas star** for your Christmas tree!");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "candles":
        if (row.goldenCoins < 100) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Not enough **🪙 golden coins** to buy the **candles** (cost: 100 🪙)");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE Event SET goldenCoins = goldenCoins - 100, decoId2 = 1 WHERE serverId = ? AND userId = ?",
            [message.guild.id, message.author.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        embed.setColor(0x00ff00).setTitle("✅ Success").setDescription("You have bought the **candles** for your Christmas tree!");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "christmas balls":
        if (row.goldenCoins < 50) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Not enough **🪙 golden coins** to buy the **Christmas balls** (cost: 50 🪙)");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE Event SET goldenCoins = goldenCoins - 50, decoId3 = 1 WHERE serverId = ? AND userId = ?",
            [message.guild.id, message.author.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        embed.setColor(0x00ff00).setTitle("✅ Success").setDescription("You have bought the **Christmas balls** for your Christmas tree!");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "tree decorations":
        if (row.goldenCoins < 50) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Not enough **🪙 golden coins** to buy the **tree decorations** (cost: 50 🪙)");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE Event SET goldenCoins = goldenCoins - 50, decoId4 = 1 WHERE serverId = ? AND userId = ?",
            [message.guild.id, message.author.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        embed.setColor(0x00ff00).setTitle("✅ Success").setDescription("You have bought the **tree decorations** for your Christmas tree!");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      default:
        embed
          .setColor(0xff0000)
          .setTitle("❌ Error")
          .setDescription("Unknown decoration, choose between: **Christmas star**, **Candles**, **Christmas balls**, **Tree decorations**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }
    }
  },
};
