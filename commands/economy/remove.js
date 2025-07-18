const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "remove",
  description: "Remove money to user, only for admins",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const embed = new EmbedBuilder();

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have the permission to add money");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (!args[1]) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("How much money are you removing from " + user.username + "?");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (isNaN(args[1])) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You must provide a valid number");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (args[1] < 1 || args[1] > 1000000) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Number must be between **1 and 1000000**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT money FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("You can't remove money from " + user.username + " because he never tried EVEN 1 of my commands! >:(");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const money = Math.trunc(args[1]);

    // handling debts logic
    if (money > row.money) {
      const debts = money - row.money;

      await new Promise((resolve, reject) => {
        client.database.run("UPDATE User SET money = 0, debts = debts + ? WHERE serverId = ? AND userId = ?", [debts, message.guild.id, user.id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else {
      await new Promise((resolve, reject) => {
        client.database.run("UPDATE User SET money = money - ? WHERE serverId = ? AND userId = ?", [money, message.guild.id, user.id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Operation completed")
      .setDescription("Successfully removed **" + money + "$** to " + user.username);

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
