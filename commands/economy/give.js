const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  name: "give",
  description: "Give money to another user",

  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const embed = new EmbedBuilder();

    // giving money to yourself? whats the point
    if (user.id == message.author.id) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't give money to yourself");
      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    // args 1 is like 'd!give @user 69' that 69 is the args[1]
    if (!args[1]) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("How much money are you giving to " + user.username + "?");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const moneyToGive = args[1];

    // first check message author's money
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
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Failed to give money to " + user.username);

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    // second check mentioned member's money
    const mUserRow = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT money FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, user.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!mUserRow) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("You can't give money to " + user.username + " because he never tried EVEN 1 of my commands! >:(");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    switch (moneyToGive) {
      case "all":
        if (row.money == 0) {
          embed.setColor(0xff0000).setTitle("❌ Transaction failed").setDescription("You don't have any money to give");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        await new Promise((resolve, reject) => {
          client.database.serialize(function () {
            // message author
            client.database.run(
              "UPDATE User SET money = 0 WHERE serverId = ? AND userId = ?",
              [message.guild.id, message.author.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );

            // mentioned user
            client.database.run(
              "UPDATE User SET money = money + ? WHERE serverId = ? AND userId = ?",
              [row.money, message.guild.id, user.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        });

        embed
          .setColor(0x33ff33)
          .setDescription("✅ You successfully gave **" + row.money + "$** to **" + user.username + "**")
          .setFields({
            name: "Transaction ended!",
            value: "💰 Now you have: **0$** in your wallet",
          });

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      default:
        if (isNaN(parseInt(moneyToGive)) || moneyToGive <= 0) {
          embed
            .setColor(0xff0000)
            .setTitle("❌ Error")
            .setDescription("Not a valid number, put a number starting from at **least 1**");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (moneyToGive > row.money) {
          embed
            .setColor(0xff0000)
            .setTitle("❌ Transaction failed")
            .setDescription("You don't have that money in your wallet to give");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        await new Promise((resolve, reject) => {
          client.database.serialize(function () {
            // message author
            client.database.run(
              "UPDATE User SET money = money - ? WHERE serverId = ? AND userId = ?",
              [moneyToGive, message.guild.id, message.author.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );

            // mentioned user
            client.database.run(
              "UPDATE User SET money = money + ? WHERE serverId = ? AND userId = ?",
              [moneyToGive, message.guild.id, user.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        });

        embed
          .setColor(0x33ff33)
          .setDescription("✅ You successfully gave **" + moneyToGive + "$** to **" + user.username + "**")
          .setFields({
            name: "Transaction ended!",
            value: "💰 Now you have: **" + (row.money - parseInt(moneyToGive)) + "$** in your wallet",
          });

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }
    }
  },
};
