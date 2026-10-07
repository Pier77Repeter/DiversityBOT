const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "lb",
  aliases: ["leaderboard"],
  description: "Shows the server money leaderboard",
  async execute(client, message, args) {
    const row = await client.database.query("SELECT user_id, money, bank_money, debts FROM users WHERE server_id = $1 ORDER BY (money + bank_money - debts) DESC LIMIT 10", [
      message.guildId,
    ]);

    const embed = new EmbedBuilder();

    if (row.rowCount === 0) {
      embed.setColor(0x00cccc).setTitle("📉 Nobody has Money").setDescription("Bruh, you all should get some work done here");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    let lbUsersList = "";
    let lbMoneyList = "";
    let index = 0; // added this because in case user is null you would see in the leaderboard skipped numbers, example: 1), 2), 4), 7). depends how many invalid users the are
    const lbRows = row.rows;

    for (let i = 0; i < lbRows.length; i++) {
      index++;
      const user = await message.client.users.fetch(lbRows[i].user_id).catch(() => null);
      const totalMoney = Number(lbRows[i].money) + Number(lbRows[i].bank_money) - Number(lbRows[i].debts);

      if (user !== null) {
        // this is just for estetics
        switch (index) {
          case 1:
            lbUsersList += `🥇 ${user.username}\n`;
            lbMoneyList += `🥇 **${totalMoney}$**\n`;
            break;

          case 2:
            lbUsersList += `🥈 ${user.username}\n`;
            lbMoneyList += `🥈 **${totalMoney}$**\n`;
            break;

          case 3:
            lbUsersList += `🥉 ${user.username}\n`;
            lbMoneyList += `🥉 **${totalMoney}$**\n`;
            break;

          default:
            lbUsersList += `${index}) ${user.username}\n`;
            lbMoneyList += `**${totalMoney}$**\n`;
            break;
        }
      }

      if (user === null) {
        index--; // prevent number skipping
      }
    }

    embed
      .setTitle("📊 Top 10 Richest Members")
      .addFields({ name: "Users", value: lbUsersList, inline: true }, { name: "Money", value: lbMoneyList, inline: true })
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
