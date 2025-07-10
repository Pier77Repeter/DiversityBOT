const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "lb",
  aliases: ["leaderboard"],
  description: "Shows the server money leaderboard",
  async execute(client, message, args) {
    const rows = await new Promise((resolve, reject) => {
      // using '.all()' because we get more than 1 row
      client.database.all(
        "SELECT userId, money, bankMoney, debts FROM User WHERE serverId = ? ORDER BY (money + bankMoney - debts) DESC LIMIT 10",
        message.guild.id,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    const embed = new EmbedBuilder();

    if (!rows) {
      embed.setColor(0x00cccc).setTitle("Nobody has money").setDescription("Bruh, you all should get some work done here");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    var leaderBoardText = "";
    var index = 0; // added this because in case user is null you would see in the leaderboard skipped numbers, example: 1), 2), 4), 7). depends how many invalid users the are

    for (let i = 0; i < rows.length; i++) {
      index++;
      const user = await message.client.users.fetch(rows[i].userId).catch(() => null);
      const totalMoney = rows[i].money + rows[i].bankMoney - rows[i].debts;

      if (user != null) {
        leaderBoardText += index + ") " + user.username + " - **" + totalMoney + "$**\n";
      }

      if (user == null) {
        index--; // prevent number skipping
      }
    }

    embed
      .setTitle("📊 Top 10 richest in the server:")
      .setDescription(leaderBoardText)
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
