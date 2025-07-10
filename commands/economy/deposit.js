const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  name: "deposit",
  aliases: ["dep"],
  description: "Deposit money into the bank",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    if (!args[0]) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Insert the amount of money you want to put in bank");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const moneyToDeposit = args[0];

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT money, bankMoney FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Failed to deposit your money");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    switch (moneyToDeposit) {
      case "all":
        if (row.money == 0) {
          embed.setColor(0xff0000).setTitle("❌ Transaction failed").setDescription("You don't have money to deposit in bank");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE User SET money = 0, bankMoney = bankMoney + ? WHERE serverId = ? AND userId = ?",
            [row.money, message.guild.id, message.author.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        embed
          .setColor(0x33ff33)
          .setDescription("✅ Successfully transfered **" + row.money + "**$ to your bank")
          .setFields({
            name: "Transaction ended!",
            value: ["💰 Now you have: **0$** in your wallet", "🏦 Now you have: **" + (row.bankMoney + row.money) + "$** in your bank"].join("\n"),
          });

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      default:
        if (isNaN(parseInt(moneyToDeposit)) || moneyToDeposit <= 0) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Not a valid number, put a number starting from at **least 1**");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (moneyToDeposit > row.money) {
          embed.setColor(0xff0000).setTitle("❌ Transaction failed").setDescription("You don't have that money to deposit in bank");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE User SET money = money - ?, bankMoney = bankMoney + ? WHERE serverId = ? AND userId = ?",
            [moneyToDeposit, moneyToDeposit, message.guild.id, message.author.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        embed
          .setColor(0x33ff33)
          .setDescription("✅ Successfully transfered **" + moneyToDeposit + "**$ to your bank")
          .setFields({
            name: "Transaction ended!",
            value: [
              "💰 Now you have: **" + (row.money - parseInt(moneyToDeposit)) + "$** in your wallet",
              "🏦 Now you have: **" + (row.bankMoney + parseInt(moneyToDeposit)) + "$** in your bank",
            ].join("\n"),
          });

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }
    }
  },
};
