const { EmbedBuilder } = require("discord.js");

// easy thing to manage money, add, subtract
module.exports = async function manageUserMoney(client, message, operation, amount) {
  const logPrefix = "[manageUserMoney/ERROR]:";

  // we gotta get money and debts in case '-' gets negative
  const row = await new Promise((resolve, reject) => {
    client.database.get(
      "SELECT money, debts FROM User WHERE serverId = ? AND userId = ?",
      [message.guild.id, message.author.id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });

  // this shouldn't happen SINCE data is created in 'messageCreate' event
  if (!row) throw "user " + message.author.id + " not found in database";

  try {
    switch (operation) {
      case "+":
        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE User SET money = money + ? WHERE serverId = ? AND userId = ?",
            [amount, message.guild.id, message.author.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        return 0;

      case "-":
        // handling debts logic
        if (amount > row.money) {
          const debts = amount - row.money;

          await new Promise((resolve, reject) => {
            client.database.run(
              "UPDATE User SET money = 0, debts = debts + ? WHERE serverId = ? AND userId = ?",
              [debts, message.guild.id, message.author.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        } else {
          await new Promise((resolve, reject) => {
            client.database.run(
              "UPDATE User SET money = money - ? WHERE serverId = ? AND userId = ?",
              [amount, message.guild.id, message.author.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        }

        return 0;

      default:
        throw "invalid operation";
    }
  } catch (error) {
    console.error(logPrefix, "Error updating user money: " + error);
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("Failed to update your money, **report this issue with your ID**")
      .addFields({ name: "Submit here", value: "https://discord.gg/KxadTdz" });

    try {
      await message.reply({ embeds: [embed] });
    } catch (error) {
      // continue
    }

    return null;
  }
};
