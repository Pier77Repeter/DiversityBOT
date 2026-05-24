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
      } catch {
        return;
      }
    }

    const moneyToWithdraw = args[0];

    const row = await client.database.query("SELECT bank_money, money FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

    if (row.rowCount === 0) {
      throw [
        "The records 'bankMoney', 'money' were NOT found in the database, CHECK THE QUERY",
        "Requested from Server: '" + message.guildId + "' - User: '" + message.author.id + "'",
      ].join("\n");
    }

    const money = Number(row.rows[0].money);
    const bankMoney = Number(row.rows[0].bank_money);

    switch (moneyToWithdraw) {
      case "all":
        if (bankMoney === 0) {
          embed.setColor(0xff0000).setTitle("❌ Transaction failed").setDescription("Looks like you have no money in the bank");

          try {
            return await message.reply({ embeds: [embed] });
          } catch {
            return;
          }
        }

        await client.database.query("UPDATE users SET bank_money = 0, money = money + $1 WHERE server_id = $2 AND user_id = $3", [
          bankMoney,
          message.guildId,
          message.author.id,
        ]);

        embed
          .setColor(0x33ff33)
          .setDescription("✅ Successfully transfered **" + bankMoney + "**$ to your wallet")
          .setFields({
            name: "Transaction ended!",
            value: ["💰 Now you have: **" + (money + bankMoney) + "$** in your wallet", "🏦 Now you have: **0$** in your bank"].join("\n"),
          });

        try {
          return await message.reply({ embeds: [embed] });
        } catch {
          return;
        }

      default:
        if (isNaN(moneyToWithdraw) || moneyToWithdraw < 1) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Not a valid number, put a number starting from **at least 1**");

          try {
            return await message.reply({ embeds: [embed] });
          } catch {
            return;
          }
        }

        if (moneyToWithdraw > bankMoney) {
          embed.setColor(0xff0000).setTitle("❌ Transaction failed").setDescription("You don't have that money to deposit in bank");

          try {
            return await message.reply({ embeds: [embed] });
          } catch {
            return;
          }
        }

        const actualMoneyToWith = Math.trunc(moneyToWithdraw);

        await client.database.query("UPDATE users SET bank_money = bank_money - $1, money = money + $2 WHERE server_id = $3 AND user_id = $4", [
          actualMoneyToWith,
          actualMoneyToWith,
          message.guildId,
          message.author.id,
        ]);

        embed
          .setColor(0x33ff33)
          .setDescription("✅ Successfully transfered **" + actualMoneyToWith + "**$ to your wallet")
          .setFields({
            name: "Transaction ended!",
            value: [
              "💰 Now you have: **" + (money + parseInt(actualMoneyToWith)) + "$** in your wallet",
              "🏦 Now you have: **" + (bankMoney - parseInt(actualMoneyToWith)) + "$** in your bank",
            ].join("\n"),
          });

        try {
          return await message.reply({ embeds: [embed] });
        } catch {
          return;
        }
    }
  },
};
