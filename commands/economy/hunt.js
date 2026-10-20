const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");
const mathRandomInt = require("../../utils/mathRandomInt");
const cooldownManager = require("../../utils/cooldownManager");
const manageUserMoney = require("../../utils/manageUserMoney");
const delay = require("../../utils/delay");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "hunt",
  description: "Hunt the animals",
  cooldown: 3600,
  async execute(client, message, args) {
    const items = await dbJsonDataGet(client, message, "items", message.author.id);
    if (items === null) return;

    const embed = new EmbedBuilder();

    if (items[11].quantity === 0) {
      embed.setColor(0xff0000).setTitle("❌ Missing Item").setDescription("You need to buy a **Kar98k Scoped** for hunting");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const cooldown = await cooldownManager(client, message, "hunt_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed.setColor(0x000000).setDescription("⏰ Break time, you can hunt again **<t:" + cooldown[1] + ":R>**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    embed.setColor(0x999999).setTitle("👓 You are waiting a prey...");

    const sentMessage = await message.reply({ embeds: [embed] }).catch(msgErrorHandler);

    if (!sentMessage) return;

    await delay(2000);

    embed.setColor(0x999999).setTitle("👓 Something is approching...");

    // can't use the 1-line version :(
    try {
      await sentMessage.edit({ embeds: [embed] });
    } catch (error) {
      return msgErrorHandler(error);
    }

    await delay(1000);

    const animals = [
      "🐖 It's a pig!",
      "🐇 It's a rabbit!",
      "🐗 It's a boar!",
      "🐟 It's a flying fish!",
      "🦌 It's a deer!",
      "🐑 It's a sheep!",
      "🐄 It's a cow!",
      "🐔 It's a chicken!",
      "🦆 It's a duck!",
      "🦃 It's a turkey!",
      "🐎 It's an horse!",
    ];

    const animal = animals[mathRandomInt(0, animals.length - 1)];

    embed.setColor(0x33cc00).setTitle(animal).setDescription("If you have a good aim you can kill it and sell it");

    const btnShoot = new ButtonBuilder().setCustomId("btn-hunt-btnShoot").setStyle(ButtonStyle.Primary).setLabel("Shoot");
    const actionRow = new ActionRowBuilder().addComponents(btnShoot);

    try {
      await sentMessage.edit({ embeds: [embed], components: [actionRow] });
    } catch (error) {
      return msgErrorHandler(error);
    }

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    let hasClicked = false;

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        return await btnInteraction.reply({ content: "You can't use his Kar98k scoped, ues your own!", flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
      }

      hasClicked = true;

      if (btnInteraction.customId == "btn-hunt-btnShoot") {
        let money;
        btnShoot.setStyle(ButtonStyle.Success).setDisabled(true);

        if (mathRandomInt(1, 7) === 1) {
          money = mathRandomInt(1200, 1500);
          items[11].quantity = 0;

          if ((await dbJsonDataSet(client, message, "items", items, message.author.id)) === null) return;
          if ((await manageUserMoney(client, message, "-", money)) === null) return;

          btnShoot.setStyle(ButtonStyle.Danger).setDisabled(true);

          embed.setColor(0xff0000).setTitle("🔫 Oh Shoot").setDescription(`You accidentally shoot at a person, you had to pay **${money}$** for the damage!`);

          return await btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
        }

        if (mathRandomInt(1, 3) == 1) {
          embed.setColor(0xff0000).setTitle("💨🔫 You Missed").setDescription("The animal heard the shoot and ran away, unlucky");
          return await btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
        }

        money = mathRandomInt(70, 150);
        if ((await manageUserMoney(client, message, "+", money)) === null) return;

        embed.setColor(0x33cc00).setTitle("💥🔫 Nice Shot").setDescription(`"You manage to shoot down the animal, and you sold it for **${money}$**"`);

        return await btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
      }
    });

    collector.on("end", async () => {
      if (!hasClicked) {
        embed.setTitle("💨 The Animal Left").setDescription("You did not shot in time, you lost your prey, gotta wait for another one to show up");

        btnShoot.setStyle(ButtonStyle.Secondary).setDisabled(true);

        return await sentMessage.edit({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
      }
    });
  },
};
