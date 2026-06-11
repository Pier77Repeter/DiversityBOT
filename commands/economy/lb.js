const { EmbedBuilder } = require("discord.js");

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
      embed.setColor(0x00cccc).setTitle("Nobody has money").setDescription("Bruh, you all should get some work done here");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    let leaderBoardText = "";
    let index = 0; // added this because in case user is null you would see in the leaderboard skipped numbers, example: 1), 2), 4), 7). depends how many invalid users the are
    const lbRows = row.rows;

    for (let i = 0; i < lbRows.length; i++) {
      index++;
      const user = await message.client.users.fetch(lbRows[i].user_id).catch(() => null);
      const totalMoney = lbRows[i].money + lbRows[i].bank_money - lbRows[i].debts;

      if (user !== null) {
        leaderBoardText += index + ") " + user.username + " - **" + totalMoney + "$**\n";
      }

      if (user === null) {
        index--; // prevent number skipping
      }
    }

    embed.setTitle("📊 Top 10 richest in the server").setDescription(leaderBoardText).setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
