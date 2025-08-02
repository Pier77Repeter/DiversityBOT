const { EmbedBuilder, ButtonBuilder, ButtonStyle, MessageFlags, ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
  name: "debts",
  description: "Check user debts",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT userId, money, bankMoney, debts FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const embed = new EmbedBuilder();

    if (!row) {
      embed
        .setColor(0x808080)
        .setTitle(user.username + " dosen't have any debts")
        .setDescription("At the moment there are no debts to pay");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const dailyIncrease = Math.trunc((row.debts + row.money + row.bankMoney) * 0.05);

    embed
      .setTitle(user.username + "'s debts")
      .setDescription(["**🧾 Debts:** `" + row.debts + "$`", "**📈 Daily increase:** `" + dailyIncrease + "$`"].join("\n"))
      .setFooter({ text: "The longer you wait, the higher the debts get" });

    const payDebtsBtn = new ButtonBuilder().setCustomId("btn-debts-btnPayDebts").setLabel("Pay debts").setStyle(ButtonStyle.Primary);

    const btnRow = new ActionRowBuilder().addComponents(payDebtsBtn);

    if (row.debts == 0) {
      embed.setColor(0x33ff33).setTitle("Looking good 👍").setDescription("You don't have debts to pay, clean").setFooter(null);

      payDebtsBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
    }

    var sentMessage;
    try {
      sentMessage = await message.reply({ embeds: [embed], components: [btnRow] });
    } catch (error) {
      return;
    }

    const btnCollector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30_000,
    });

    btnCollector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await btnInteraction.reply({ content: "This button isn't for you", flags: MessageFlags.Ephemeral });
        } catch (error) {
          return;
        }
      }

      if (row.userId !== message.author.id) {
        try {
          return await btnInteraction.reply({
            content: "You wont to pay debts for someone else? Nah you won't",
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          return;
        }
      }

      if (btnInteraction.customId === "btn-debts-btnPayDebts") {
        if (row.money == 0) {
          embed
            .setColor(0xff0000)
            .setTitle("❌ Error")
            .setDescription("You have 0 money in your wallet, you need to withdraw them from your bank")
            .setFooter(null);
          payDebtsBtn.setDisabled(true);

          try {
            return await btnInteraction.update({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return;
          }
        }

        // determine the amount to pay, either all the money in wallet or the total amount of debts
        const amountToPay = Math.min(row.money, row.debts);
        const newDebts = row.debts - amountToPay;
        const newMoney = row.money - amountToPay;

        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE User SET debts = ?, money = ? WHERE serverId = ? AND userId = ?",
            [newDebts, newMoney, message.guild.id, user.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        embed.setColor(0x33ff33).setTitle("✅ Payment successful").setFooter(null);

        if (newDebts > 0) {
          embed.setDescription(["You paid **" + amountToPay + "$** towards your debts", "You still owe **" + newDebts + "$**"].join("\n"));
        } else {
          embed.setDescription("You paid off your remaining debts for **" + amountToPay + "$**");
        }

        payDebtsBtn.setStyle(ButtonStyle.Success).setDisabled(true);

        try {
          return await btnInteraction.update({ embeds: [embed], components: [btnRow] });
        } catch (error) {
          return;
        }
      }
    });

    btnCollector.on("end", async () => {
      payDebtsBtn.setDisabled(true);

      try {
        return await sentMessage.edit({ embeds: [embed], components: [btnRow] });
      } catch (error) {
        return;
      }
    });
  },
};
