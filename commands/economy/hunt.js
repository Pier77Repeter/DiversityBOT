const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");
const mathRandomInt = require("../../utils/mathRandomInt");
const cooldownManager = require("../../utils/cooldownManager");
const manageUserMoney = require("../../utils/manageUserMoney");
const delay = require("../../utils/delay");

module.exports = {
  name: "hunt",
  description: "Hunt the animals",
  cooldown: 3600,
  async execute(client, message, args) {
    const items = await dbJsonDataGet(client, message.author, message, "items");
    if (items == null) return;

    const embed = new EmbedBuilder();

    if (!items.itemId12) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need to buy a **Kar98k Scoped** for hunting");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const cooldown = await cooldownManager(client, message, "huntCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ Break time, you can hunt again: **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    var sentMessage;

    embed.setColor(0x999999).setTitle("👓 You are waiting a prey...");

    try {
      sentMessage = await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }

    await delay(2000);

    embed.setColor(0x999999).setTitle("👓 Something is approching...");

    try {
      await sentMessage.edit({ embeds: [embed] });
    } catch (error) {
      return;
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
      return;
    }

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    var hasClicked = false;

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await btnInteraction.reply({
            content: "You can't use his Kar98k scoped!",
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          return;
        }
      }

      hasClicked = true;

      if (btnInteraction.customId == "btn-hunt-btnShoot") {
        var money;
        btnShoot.setStyle(ButtonStyle.Success).setDisabled(true);

        if (mathRandomInt(1, 5) == 1) {
          money = mathRandomInt(800, 1500);
          items.itemId12 = false;

          if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
          if ((await manageUserMoney(client, message, "-", money)) == null) return;

          btnShoot.setStyle(ButtonStyle.Danger).setDisabled(true);

          embed
            .setColor(0xff0000)
            .setTitle("🔫 Oh shoot")
            .setDescription("You accidentally shoot at a person, you had to pay **" + money + "$** for the damage!");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
        }

        if (mathRandomInt(1, 3) == 1) {
          embed.setColor(0xff0000).setTitle("💨🔫 You missed").setDescription("The animal heard the shoot and ran away, unlucky");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
        }

        money = mathRandomInt(70, 150);
        if ((await manageUserMoney(client, message, "+", money)) == null) return;

        embed
          .setColor(0x33cc00)
          .setTitle("💥🔫 Nice shot")
          .setDescription("You manage to shoot down the animal, and you sold it for **" + money + "$**");

        try {
          return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
        } catch (error) {
          return;
        }
      }
    });

    collector.on("end", async () => {
      if (!hasClicked) {
        embed.setTitle("💨 The animal left").setDescription("You did nothing and you lost your prey, gotta wait for another one to show up");

        btnShoot.setStyle(ButtonStyle.Secondary).setDisabled(true);

        try {
          return await sentMessage.edit({ embeds: [embed], components: [actionRow] });
        } catch (error) {
          return;
        }
      }
    });
  },
};
