const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "balance",
  aliases: ["bal", "money"],
  description: "Check user balance",
  async execute(client, message, args) {
    // THIS IS PERFECT, USE THIS WHEN CHECKING IF MENTIONED USER OR MESSAGE AUTHOR
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT money, bankMoney, debts FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, user.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // fuck this, this is shorter insted of typing <commandName>MessageEmbed, no one cares about this!!!!
    const embed = new EmbedBuilder();

    if (!row) {
      embed
        .setColor(0x808080)
        .setTitle(user.username + " dosen't have any money")
        .setDescription("Exactly **0**, use some commands to get moneys, you ain't getting those for free");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const totalMoney = row.money + row.bankMoney - row.debts;

    embed
      .setTitle(user.username + "'s balance")
      .setDescription(
        [
          "**💰 Wallet money: +** `" + row.money + "$`",
          "**🏦 Bank money: +** `" + row.bankMoney + "$`",
          "**⚖️ Debts to pay: -** `" + row.debts + "$`",
          "------------------",
          "**📊 Total money: =** `" + totalMoney + "$`",
        ].join("\n")
      );

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
