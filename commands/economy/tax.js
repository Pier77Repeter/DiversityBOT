const { EmbedBuilder } = require("@discordjs/builders");
const { economySettings } = require("../../config.json");

module.exports = {
  name: "tax",
  aliases: ["taxes"],
  description: "Check your current taxing rate",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const res = await client.database.query("SELECT money, bank_money FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

    const embed = new EmbedBuilder();

    if (res.rowCount === 0) {
      embed
        .setColor(0x808080)
        .setTitle(user.username + "'s taxes")
        .setDescription(["**📊 Total money: ** `0$`", "**🪙 Daily tax: ** `0$`", "**⚖️ Tax rate: ** `0%`"].join("\n"));

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const wealth = Number(res.rows[0].money) + Number(res.rows[0].bank_money);
    const taxRate = economySettings.maxTaxRate * (wealth / (wealth + economySettings.halfwayConstant));
    const taxAmount = Math.floor(economySettings.dailyEarnings * taxRate);

    embed
      .setColor(0x808080)
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL(),
      })
      .addFields(
        { name: "Names", value: "\n📊 Total money\n🪙 Daily tax\n⚖️ Tax rate", inline: true },
        { name: "Values", value: "\n`" + wealth + "$`\n`" + taxAmount + "$`\n`" + (taxRate * 100).toFixed(2) + "%`", inline: true },
      )
      .setFooter({ text: "Taxes are automatically paid every day" });

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
