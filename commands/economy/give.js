const { EmbedBuilder } = require("@discordjs/builders");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "give",
  description: "Give money to another user",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const embed = new EmbedBuilder();

    // giving money to yourself? whats the point
    if (user.id === message.author.id) {
      embed.setColor(0xff0000).setTitle("❌ Nope").setDescription("You can't give money to yourself");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    // args 1 is like 'd!give @user 69' that 69 is the args[1]
    if (!args[1]) {
      embed.setColor(0xff0000).setTitle("❌ Missing Money").setDescription(`How much money are you giving to ${user.username}?`);
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const moneyToGive = args[1];

    // first check message author's money
    const row = await client.database.query("SELECT money FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

    if (!row) {
      throw `The record 'money' was NOT found in the database, requested from Server: '${message.guildId}' - User: '${message.author.id}'`;
    }

    // second check mentioned member's money
    const mUserRow = await client.database.query("SELECT money FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

    if (mUserRow.rowCount === 0) {
      embed.setColor(0xff0000).setTitle("❌ Nope").setDescription(`You can't give money to ${user.username} because he never tried EVEN 1 of my commands! >:(`);
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const money = Number(row.rows[0].money);

    switch (moneyToGive) {
      case "all":
        if (money === 0) {
          embed.setColor(0xff0000).setTitle("❌ Transaction Failed").setDescription("You don't have any money in your wallet to give");
          return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        }

        await client.database.query("UPDATE users SET money = 0 WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);
        await client.database.query("UPDATE users SET money = money + $1 WHERE server_id = $2 AND user_id = $3", [money, message.guildId, user.id]);

        embed.setColor(0x33ff33).setDescription(`✅ You successfully gave **${money}$** to **${user.username}**"`).setFields({
          name: "Transaction Ended!",
          value: "💰 Now you have: **0$** in your wallet",
        });

        return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);

      default:
        if (isNaN(moneyToGive) || moneyToGive < 1) {
          embed.setColor(0xff0000).setTitle("❌ Invalid Number").setDescription("Not a valid number, put a number starting from **at least 1**");
          return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        }

        if (moneyToGive > money) {
          embed.setColor(0xff0000).setTitle("❌ Transaction Failed").setDescription("You don't have that amount of money in your wallet to give");
          return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        }

        const moneyToActuallyGive = Math.trunc(moneyToGive);

        await client.database.query("UPDATE users SET money = money - $1 WHERE server_id = $2 AND user_id = $3", [moneyToActuallyGive, message.guildId, message.author.id]);
        await client.database.query("UPDATE users SET money = money + $1 WHERE server_id = $2 AND user_id = $3", [moneyToActuallyGive, message.guildId, user.id]);

        embed
          .setColor(0x33ff33)
          .setDescription(`✅ You successfully gave **${moneyToActuallyGive}$** to **${user.username}**`)
          .setFields({
            name: "Transaction Ended!",
            value: `💰 Now you have: **${money - parseInt(moneyToActuallyGive)}$** in your wallet`,
          });

        return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }
  },
};
