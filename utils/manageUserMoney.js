const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("ManageUserMoney");

// easy thing to manage money, add, subtract ONLY for message author!!!
module.exports = async function manageUserMoney(client, message, operation, amount) {
  // we gotta get money and debts in case '-' gets negative
  const row = await client.database.query("SELECT money, bank_money, debts FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

  // this shouldn't happen SINCE data is created in 'messageCreate' event
  if (row.rowCount === 0) throw new Error("Failed to find in database: Server '" + message.guildId + "' - User '" + message.author.id + "'");

  // INTSSSSSSSSSSSSSSSSS
  const money = Number(row.rows[0].money);
  const bank_money = Number(row.rows[0].bank_money);

  try {
    switch (operation) {
      case "+":
        // User has hit the maximum possible limit
        if (money + bank_money >= 999999999999999999) {
          const embed = new EmbedBuilder().setColor(0xff0000).setTitle("❌ You are too rich!").setDescription("You reached the maximum possible limit of **999999999999999999$**");

          try {
            return await message.reply({ embeds: [embed] });
          } catch {
            return;
          }
        }

        await client.database.query("UPDATE users SET money = money + $1 WHERE server_id = $2 AND user_id = $3", [amount, message.guildId, message.author.id]);

        return 0;

      case "-":
        // handling debts logic
        if (amount > money) {
          const debts = amount - money;

          // user has lots of debts... just do nothing
          if (debts >= -999999999999999999) return 0;

          await client.database.query("UPDATE users SET money = 0, debts = debts + $1 WHERE server_id = $2 AND user_id = $3", [debts, message.guildId, message.author.id]);
        } else {
          await client.database.query("UPDATE users SET money = money - $1 WHERE server_id = $2 AND user_id = $3", [amount, message.guildId, message.author.id]);
        }

        return 0;

      default:
        throw new Error("Invalid operation, manage user money with '+' or '-'");
    }
  } catch (error) {
    logger.error("Error updating user money: Server '" + message.guildId + "' - User '" + message.author.id + "'", error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("Failed to update your money, please **report this error with the server id and your user id**")
      .addFields(
        { name: "Server ID", value: `\`${message.guildId}\``, inline: true },
        { name: "User ID", value: `\`${message.author.id}\``, inline: true },
        { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" },
      );

    try {
      await message.reply({ embeds: [embed] });
    } catch {
      // continue
    }

    return null;
  }
};
