const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags } = require("discord.js");
const cooldownManager = require("../../utils/cooldownManager");
const manageUserMoney = require("../../utils/manageUserMoney");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const mathRandomInt = require("../../utils/mathRandomInt");

module.exports = {
  name: "crime",
  description: "Commit a crime to get money",
  cooldown: 14400,
  async execute(client, message, args) {
    const items = await dbJsonDataGet(client, message.author, message, "items");
    if (items == null) return;

    const embed = new EmbedBuilder();

    if (!items.itemId5) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need an **AK-47** to commit a crime");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const cooldown = await cooldownManager(client, message, "crimeCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ You will able to commit another crime again: **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    embed.setColor(0x3366ff).setTitle("🦹 Villain time").setDescription("Choose the crime you want to commit, if you fail you WILL lose a lot of money");

    const btnMuder = new ButtonBuilder().setCustomId("btn-crime-btnMurder").setLabel("Murder").setStyle(ButtonStyle.Primary);
    const btnArson = new ButtonBuilder().setCustomId("btn-crime-btnArson").setLabel("Arson").setStyle(ButtonStyle.Primary);
    const btnRobbery = new ButtonBuilder().setCustomId("btn-crime-btnRobbery").setLabel("Robbery").setStyle(ButtonStyle.Primary);
    const btnDrug = new ButtonBuilder().setCustomId("btn-crime-btnDrug").setLabel("Drug").setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder().addComponents(btnMuder, btnArson, btnRobbery, btnDrug);

    var sentMessage;

    try {
      sentMessage = await message.reply({ embeds: [embed], components: [actionRow] });
    } catch (error) {
      return;
    }

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    var money,
      hasClickedBtn = false;

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await btnInteraction.reply({
            content: "You better not commit a crime",
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          return;
        }
      }

      hasClickedBtn = true;

      if (mathRandomInt(1, 4) == 1) {
        btnMuder.setStyle(ButtonStyle.Danger).setDisabled(true);
        btnArson.setStyle(ButtonStyle.Danger).setDisabled(true);
        btnRobbery.setStyle(ButtonStyle.Danger).setDisabled(true);
        btnDrug.setStyle(ButtonStyle.Danger).setDisabled(true);

        money = mathRandomInt(2000, 4000);

        if ((await manageUserMoney(client, message, "-", money)) == null) return;

        embed
          .setColor(0x660000)
          .setTitle("🧑‍⚖️ You got arrested")
          .setDescription("You paid **" + money + "$** for all the damage you've made");

        try {
          return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
        } catch (error) {
          return;
        }
      }

      switch (btnInteraction.customId) {
        case "btn-crime-btnMurder":
          btnMuder.setStyle(ButtonStyle.Success).setDisabled(true);
          btnArson.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnRobbery.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDrug.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(700, 1200);

          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x990000)
            .setTitle("🕵️‍♂️ Hitman")
            .setDescription("You killed a rich corrupted guy, for this mission you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-crime-btnArson":
          btnMuder.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnArson.setStyle(ButtonStyle.Success).setDisabled(true);
          btnRobbery.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDrug.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(700, 1200);

          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x990000)
            .setTitle("🕵️‍♂️ You commited ARSON")
            .setDescription("You burned down a whole forest, you needed to wood to build the house, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-crime-btnRobbery":
          btnMuder.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnArson.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnRobbery.setStyle(ButtonStyle.Success).setDisabled(true);
          btnDrug.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(700, 1200);

          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x990000)
            .setTitle("🕵️‍♂️ You robbed a bank")
            .setDescription("You trolled the bank and you took all the money, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-crime-btnDrug":
          btnMuder.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnArson.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnRobbery.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDrug.setStyle(ButtonStyle.Success).setDisabled(true);

          money = mathRandomInt(700, 1200);

          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x990000)
            .setTitle("🕵️‍♂️ You sold coke")
            .setDescription("Your number 1 client, Hausemaster, gave you **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
      }
    });

    collector.on("end", async () => {
      if (!hasClickedBtn) {
        embed.setTitle("🕵️‍♂️ Changed idea?").setDescription("So you decided to not commit a crime this time?");

        btnMuder.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnArson.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnRobbery.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnDrug.setStyle(ButtonStyle.Secondary).setDisabled(true);

        try {
          return await sentMessage.edit({ embeds: [embed], components: [actionRow] });
        } catch (error) {
          return;
        }
      }
    });
  },
};
