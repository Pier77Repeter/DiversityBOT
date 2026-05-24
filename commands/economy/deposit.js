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
      } catch {
        return;
      }
    }

    const moneyToDeposit = args[0];

    const row = await client.database.query("SELECT money, bank_money FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

    if (row.rowCount === 0) {
      throw new Error(
        [
          "The records: 'money', 'bankMoney' were NOT found in the database, CHECK THE QUERY",
          "Requested from Server: '" + message.guildId + "' - User: '" + message.author.id + "'",
        ].join("\n"),
      );
    }

    const money = Number(row.rows[0].money);
    const bankMoney = Number(row.rows[0].bank_money);

    switch (moneyToDeposit) {
      case "all":
        if (money === 0) {
          embed.setColor(0xff0000).setTitle("❌ Transaction failed").setDescription("You don't have money to deposit in bank");

          try {
            return await message.reply({ embeds: [embed] });
          } catch {
            return;
          }
        }

        await client.database.query("UPDATE users SET money = 0, bank_money = bank_money + $1 WHERE server_id = $2 AND user_id = $3", [
          money,
          message.guildId,
          message.author.id,
        ]);

        embed
          .setColor(0x33ff33)
          .setDescription("✅ Successfully transfered **" + money + "**$ to your bank")
          .setFields({
            name: "Transaction ended!",
            value: ["💰 Now you have: **0$** in your wallet", "🏦 Now you have: **" + (bankMoney + money) + "$** in your bank"].join("\n"),
          });

        try {
          return await message.reply({ embeds: [embed] });
        } catch {
          return;
        }

      default:
        if (isNaN(moneyToDeposit) || moneyToDeposit < 1) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Not a valid number, put a number starting from **at least 1**");

          try {
            return await message.reply({ embeds: [embed] });
          } catch {
            return;
          }
        }

        if (moneyToDeposit > money) {
          embed.setColor(0xff0000).setTitle("❌ Transaction failed").setDescription("You don't have that money to deposit in bank");

          try {
            return await message.reply({ embeds: [embed] });
          } catch {
            return;
          }
        }

        const moneyToDep = Math.trunc(moneyToDeposit);

        await client.database.query("UPDATE users SET money = money - $1, bank_money = bank_money + $2 WHERE server_id = $3 AND user_id = $4", [
          moneyToDep,
          moneyToDep,
          message.guildId,
          message.author.id,
        ]);

        embed
          .setColor(0x33ff33)
          .setDescription("✅ Successfully transfered **" + moneyToDep + "**$ to your bank")
          .setFields({
            name: "Transaction ended!",
            value: [
              "💰 Now you have: **" + (money - parseInt(moneyToDep)) + "$** in your wallet",
              "🏦 Now you have: **" + (bankMoney + parseInt(moneyToDep)) + "$** in your bank",
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
