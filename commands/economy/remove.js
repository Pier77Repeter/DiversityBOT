const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "remove",
  description: "Remove money to user, only for admins",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const embed = new EmbedBuilder();

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("You don't have the `Administrator` permission to add money");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!args[1]) {
      embed.setColor(0xff0000).setTitle("❌ Missing Amount").setDescription(`How much money are you removing from ${user.username}?`);

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (isNaN(args[1])) {
      embed.setColor(0xff0000).setTitle("❌ Invalid Number").setDescription("You must provide a valid integer number");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (args[1] < 1 || args[1] > 1000000) {
      embed.setColor(0xff0000).setTitle("❌ Out of Range").setDescription("Number must be between **1 and 1000000**");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const row = await client.database.query("SELECT money FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

    if (row.rowCount === 0) {
      embed.setColor(0xff0000).setTitle("❌ Nope").setDescription(`You can't remove money from ${user.username} because he never tried EVEN 1 of my commands! >:(`);

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const money = Math.trunc(args[1]);
    const rowMoney = Number(row.rows[0].money);

    // handling debts logic
    if (money > rowMoney) {
      const debts = money - rowMoney;

      await client.database.query("UPDATE users SET money = 0, debts = debts + $1 WHERE server_id = $2 AND user_id = $3", [debts, message.guildId, user.id]);
    } else {
      await client.database.query("UPDATE users SET money = money - $1 WHERE server_id = $2 AND user_id = $3", [money, message.guildId, user.id]);
    }

    embed.setColor(0x33ff33).setTitle("✅ Operation Completed").setDescription(`Successfully removed **${money}$** to ${user.username}`);

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
