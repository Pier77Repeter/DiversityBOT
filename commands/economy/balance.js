const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "balance",
  aliases: ["bal", "money"],
  description: "Check user balance",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await client.database.query("SELECT money, bank_money, debts FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

    const embed = new EmbedBuilder();

    if (row.rowCount === 0) {
      embed
        .setColor(0x808080)
        .setTitle(user.username + " dosen't have any money")
        .setDescription("Exactly **0$**, because he didn't use even **1** of my commands >:(")
        .setFooter({ text: "you ain't getting money for free" });

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const rowData = row.rows[0];
    // REMEBER, these values are BIGINT in db, they need to be converted BEFORE using them for operations, for outputting it's fine
    const totalMoney = Number(rowData.money) + Number(rowData.bank_money) - Number(rowData.debts);

    embed
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL(),
      })
      .setDescription("**📊 Total money: ** `" + totalMoney + "$`")
      .addFields(
        { name: "Names", value: "\n💰 Wallet money\n🏦 Bank money\n⚖️ Debts to pay", inline: true },
        { name: "Values", value: "\n`" + rowData.money + "$`\n`" + rowData.bank_money + "$`\n`" + rowData.debts + "$`", inline: true },
      );

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
