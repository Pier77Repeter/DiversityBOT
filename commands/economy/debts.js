const { EmbedBuilder, ButtonBuilder, ButtonStyle, MessageFlags, ActionRowBuilder, ComponentType } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "debts",
  description: "Check user debts",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    let row = await client.database.query("SELECT user_id, money, bank_money, debts FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

    const embed = new EmbedBuilder();

    if (row.rowCount === 0) {
      embed.setColor(0x808080).setTitle(`${user.username} dosen't have any debts`).setDescription("At the moment there are no debts to pay");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    // check if the row exist, then assign
    let data = row.rows[0];
    let money = Number(data.money);
    let debts = Number(data.debts);

    // 3% of everything, seems gut
    const dailyIncrease = Math.trunc((debts + money + Number(data.bank_money)) * 0.03);

    embed
      .setTitle(`${user.username}'s Debts`)
      .setDescription([`**🧾 Debts:** \`${debts}$\``, `**📈 Daily increase:** \`${dailyIncrease}$\``].join("\n"))
      .setFooter({ text: "The longer you wait, the higher the debts get" });

    const payDebtsBtn = new ButtonBuilder().setCustomId("btn-debts-btnPayDebts").setLabel("Pay debts").setStyle(ButtonStyle.Primary);
    const btnRow = new ActionRowBuilder().addComponents(payDebtsBtn);

    if (debts === 0) {
      embed.setColor(0x33ff33).setTitle("Looking Good 👍").setDescription("You don't have debts to pay, clean").setFooter(null);

      payDebtsBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
    }

    const sentMessage = await message.reply({ embeds: [embed], components: [btnRow] }).catch(msgErrorHandler);
    if (!sentMessage) return;

    const btnCollector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30_000,
    });

    btnCollector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        btnInteraction.reply({ content: "This button isn't for you", flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
        return;
      }

      if (data.user_id !== message.author.id) {
        btnInteraction.reply({ content: "You want to pay debts for someone else? Nah you won't", flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
        return;
      }

      if (btnInteraction.customId === "btn-debts-btnPayDebts") {
        // re-cheking the money, since you could send the command 2 times and fuck up everything
        row = await client.database.query("SELECT user_id, money, bank_money, debts FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);
        data = row.rows[0]; // update the let

        if (money === 0) {
          embed.setColor(0xff0000).setTitle("❌ Not Enough Money").setDescription("You have **0$ in your wallet**, you need to withdraw them from your bank").setFooter(null);

          payDebtsBtn.setDisabled(true);

          btnInteraction.update({ embeds: [embed], components: [btnRow] }).catch(msgErrorHandler);
          return;
        }

        // determine the amount to pay, either all the money in wallet or the total amount of debts
        const amountToPay = Math.min(money, debts);
        const newDebts = debts - amountToPay;
        const newMoney = money - amountToPay;

        await client.database.query("UPDATE users SET debts = $1, money = $2 WHERE server_id = $3 AND user_id = $4", [newDebts, newMoney, message.guildId, user.id]);

        embed.setColor(0x33ff33).setTitle("✅ Payment Successful").setFooter(null);

        if (newDebts > 0) {
          embed.setDescription([`You paid **${amountToPay}$** towards your debts`, `You still owe **${newDebts}$**`].join("\n"));
        } else {
          embed.setDescription(`You paid off your remaining debts for **${amountToPay}$**`);
        }

        payDebtsBtn.setStyle(ButtonStyle.Success).setDisabled(true);

        btnInteraction.update({ embeds: [embed], components: [btnRow] }).catch(msgErrorHandler);
      }
    });

    btnCollector.on("end", async () => {
      payDebtsBtn.setDisabled(true);

      sentMessage.edit({ embeds: [embed], components: [btnRow] }).catch(msgErrorHandler);
    });
  },
};
