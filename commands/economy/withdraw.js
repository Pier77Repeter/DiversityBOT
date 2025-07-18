const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  name: "withdraw",
  aliases: ["with"],
  description: "Withdraw money into the bank",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    if (!args[0]) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Insert the amount of money you want to put in your wallet");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const moneyToWithdraw = args[0];

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT bankMoney, money FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Failed to withdraw your money");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    switch (moneyToWithdraw) {
      case "all":
        if (row.bankMoney == 0) {
          embed.setColor(0xff0000).setTitle("❌ Transaction failed").setDescription("Looks like you have no money in the bank");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE User SET bankMoney = 0, money = money + ? WHERE serverId = ? AND userId = ?",
            [row.bankMoney, message.guild.id, message.author.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        embed
          .setColor(0x33ff33)
          .setDescription("✅ Successfully transfered **" + row.bankMoney + "**$ to your wallet")
          .setFields({
            name: "Transaction ended!",
            value: ["💰 Now you have: **" + (row.money + row.bankMoney) + "$** in your wallet", "🏦 Now you have: **0$** in your bank"].join("\n"),
          });

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      default:
        if (isNaN(moneyToWithdraw) || moneyToWithdraw < 1) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Not a valid number, put a number starting from **at least 1**");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (moneyToWithdraw > row.bankMoney) {
          embed.setColor(0xff0000).setTitle("❌ Transaction failed").setDescription("You don't have that money to deposit in bank");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        const money = Math.trunc(moneyToWithdraw);

        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE User SET bankMoney = bankMoney - ?, money = money + ? WHERE serverId = ? AND userId = ?",
            [money, money, message.guild.id, message.author.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        embed
          .setColor(0x33ff33)
          .setDescription("✅ Successfully transfered **" + money + "**$ to your wallet")
          .setFields({
            name: "Transaction ended!",
            value: [
              "💰 Now you have: **" + (row.money + parseInt(money)) + "$** in your wallet",
              "🏦 Now you have: **" + (row.bankMoney - parseInt(money)) + "$** in your bank",
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
