const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags } = require("discord.js");
const cooldownManager = require("../../utils/cooldownManager");
const manageUserMoney = require("../../utils/manageUserMoney");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const mathRandomInt = require("../../utils/mathRandomInt");
const msgErrorHandler = require("../../utils/msgErrorHandler");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");

module.exports = {
  name: "crime",
  description: "Commit a crime to get money",
  cooldown: 14400,
  async execute(client, message, args) {
    const items = await dbJsonDataGet(client, message, "items", message.author.id);
    if (items === null) return;

    const embed = new EmbedBuilder();

    // item with id 7 is at index id - 1, which is 6
    if (items[4].quantity === 0) {
      embed.setColor(0xff0000).setTitle("❌ Missing Item").setDescription("You need an **AK-47** to commit a crime");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const cooldown = await cooldownManager(client, message, "crime_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed.setColor(0x000000).setDescription(`⏰ You will able to commit another crime again: **<t:${cooldown[1]}:R>**`);

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    embed.setColor(0x3366ff).setTitle("🦹 Villain Time").setDescription("Choose the crime you want to commit, if you fail you WILL lose a lot of money");

    const btnMuder = new ButtonBuilder().setCustomId("btn-crime-btnMurder").setLabel("Murder").setStyle(ButtonStyle.Primary);
    const btnArson = new ButtonBuilder().setCustomId("btn-crime-btnArson").setLabel("Arson").setStyle(ButtonStyle.Primary);
    const btnRobbery = new ButtonBuilder().setCustomId("btn-crime-btnRobbery").setLabel("Robbery").setStyle(ButtonStyle.Primary);
    const btnDrug = new ButtonBuilder().setCustomId("btn-crime-btnDrug").setLabel("Drug").setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder().addComponents(btnMuder, btnArson, btnRobbery, btnDrug);

    const sentMessage = await message.reply({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
    if (!sentMessage) return;

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    let money,
      hasClickedBtn = false;

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        btnInteraction.reply({ content: "You better not commit a crime for someone else", flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
        return;
      }

      hasClickedBtn = true;

      if (mathRandomInt(1, 5) === 1) {
        btnMuder.setStyle(ButtonStyle.Danger).setDisabled(true);
        btnArson.setStyle(ButtonStyle.Danger).setDisabled(true);
        btnRobbery.setStyle(ButtonStyle.Danger).setDisabled(true);
        btnDrug.setStyle(ButtonStyle.Danger).setDisabled(true);

        money = mathRandomInt(3000, 4000);
        items[4].quantity = 0;

        if ((await manageUserMoney(client, message, "-", money)) === null) return;
        if ((await dbJsonDataSet(client, message, "items", items, message.author.id)) === null) return;

        embed.setColor(0x660000).setTitle("🧑‍⚖️ You Got Arrested").setDescription(`You paid **${money}$** for all the damage you've made`);

        btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
        return;
      }

      switch (btnInteraction.customId) {
        case "btn-crime-btnMurder":
          btnMuder.setStyle(ButtonStyle.Success).setDisabled(true);
          btnArson.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnRobbery.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDrug.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(700, 1200);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          embed.setColor(0x990000).setTitle("🕵️‍♂️ Hitman").setDescription(`You killed a rich corrupted guy, for this mission you got **${money}$**`);

          btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
          return;

        case "btn-crime-btnArson":
          btnMuder.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnArson.setStyle(ButtonStyle.Success).setDisabled(true);
          btnRobbery.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDrug.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(700, 1200);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          embed.setColor(0x990000).setTitle("🕵️‍♂️ You Commited ARSON").setDescription(`You burned down a whole forest, you needed to wood to build the house, you got **${money}$**`);

          btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
          return;

        case "btn-crime-btnRobbery":
          btnMuder.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnArson.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnRobbery.setStyle(ButtonStyle.Success).setDisabled(true);
          btnDrug.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(700, 1200);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          embed.setColor(0x990000).setTitle("🕵️‍♂️ You Robbed a Bank").setDescription(`You trolled the bank and you took all the money, you got **${money}$**`);

          btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
          return;

        case "btn-crime-btnDrug":
          btnMuder.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnArson.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnRobbery.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDrug.setStyle(ButtonStyle.Success).setDisabled(true);

          money = mathRandomInt(700, 1200);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          embed.setColor(0x990000).setTitle("🕵️‍♂️ You Sold Coke").setDescription(`Your number 1 client, Hausemaster, gave you **${money}$**`);

          btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
          return;
      }
    });

    collector.on("end", async () => {
      if (!hasClickedBtn) {
        embed.setTitle("🕵️‍♂️ Changed Idea").setDescription("So you've decided to not commit a crime this time?");

        btnMuder.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnArson.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnRobbery.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnDrug.setStyle(ButtonStyle.Secondary).setDisabled(true);

        sentMessage.edit({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
      }
    });
  },
};
