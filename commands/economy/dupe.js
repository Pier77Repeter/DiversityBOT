const { EmbedBuilder } = require("@discordjs/builders");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags } = require("discord.js");
const cooldownManager = require("../../utils/cooldownManager");
const manageUserMoney = require("../../utils/manageUserMoney");
const mathRandomInt = require("../../utils/mathRandomInt");
const delay = require("../../utils/delay");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "dupe",
  description: "Dupe some money without being catch by Hausemaster",
  cooldown: 21600,
  async execute(client, message, args) {
    const cooldown = await cooldownManager(client, message, "dupe_cooldown", this.cooldown);
    if (cooldown === null) return;

    const embed = new EmbedBuilder();

    if (cooldown) {
      embed.setColor(0x000000).setDescription(`⏰ Don't doop too fast, do it later **<t:${cooldown[1]}:R>**`);

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    embed.setColor(0xff6600).setTitle("🪄 Available Dupes").setDescription("Select one of the following methods to duplicate your money");

    const btnDupeDonkey = new ButtonBuilder().setCustomId("btn-dupe-btnDupeDonkey").setLabel("Donkey").setStyle(ButtonStyle.Primary);
    const btnDupeChunk = new ButtonBuilder().setCustomId("btn-dupe-btnDupeChunk").setLabel("Chunk").setStyle(ButtonStyle.Primary);
    const btnDupeAlt = new ButtonBuilder().setCustomId("btn-dupe-btnDupeAlt").setLabel("Alt F4").setStyle(ButtonStyle.Primary);
    const btnDupePopbob = new ButtonBuilder().setCustomId("btn-dupe-btnDupePopbob").setLabel("popbob").setStyle(ButtonStyle.Primary);

    const btnRow = new ActionRowBuilder().addComponents(btnDupeDonkey, btnDupeChunk, btnDupeAlt);

    // popbob secret dupe chance to appear in the dupe menu
    if (mathRandomInt(1, 5) === 5) {
      btnRow.addComponents(btnDupePopbob);
    }

    let money,
      hasClickedBtn = false;

    const sentMessage = await message.reply({ embeds: [embed], components: [btnRow] }).catch(msgErrorHandler);

    const btnCollector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    btnCollector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        return await btnInteraction.reply({ content: "This isn't your dooping button", flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
      }

      hasClickedBtn = true;

      switch (btnInteraction.customId) {
        case "btn-dupe-btnDupeDonkey":
          embed.setTitle("🖥️ You start doing the donkey dupe...").setDescription(null);

          btnDupeDonkey.setStyle(ButtonStyle.Success).setDisabled(true);
          btnDupeChunk.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDupeAlt.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDupePopbob.setStyle(ButtonStyle.Secondary).setDisabled(true);

          await btnInteraction.update({ embeds: [embed], components: [btnRow] }).catch(msgErrorHandler);

          await delay(3000);

          // the chance to fail to doop
          if (mathRandomInt(1, 6) === 1) {
            money = mathRandomInt(2000, 3000);

            if ((await manageUserMoney(client, message, "-", money)) === null) return;

            embed.setColor(0xff0000).setTitle("👮 Hausemaster Caught You").setDescription(`Hause saw you duping, and removed **${money}$** from your balance`);

            return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);
          }

          money = mathRandomInt(200, 300);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          embed.setColor(0x33ff33).setTitle("✅ Dupe Completed").setDescription(`You successfully did the dupe and got **${money}$**`);

          return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

        case "btn-dupe-btnDupeChunk":
          embed.setTitle("🖥️ You start doing the chunk dupe...").setDescription(null);

          btnDupeDonkey.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDupeChunk.setStyle(ButtonStyle.Success).setDisabled(true);
          btnDupeAlt.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDupePopbob.setStyle(ButtonStyle.Secondary).setDisabled(true);

          await btnInteraction.update({ embeds: [embed], components: [btnRow] }).catch(msgErrorHandler);

          await delay(3000);

          if (mathRandomInt(1, 6) === 1) {
            money = mathRandomInt(2000, 3000);

            if ((await manageUserMoney(client, message, "-", money)) === null) return;

            embed.setColor(0xff0000).setTitle("👮 Hausemaster Caught You").setDescription(`Hause saw you duping, and removed **${money}$** from your balance`);

            return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);
          }

          money = mathRandomInt(200, 300);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          embed.setColor(0x33ff33).setTitle("✅ Dupe Completed").setDescription(`You successfully did the dupe and got **${money}$**`);

          return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

        case "btn-dupe-btnDupeAlt":
          embed.setTitle("🖥️ You start doing the Alf F4 dupe...").setDescription(null);

          btnDupeDonkey.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDupeChunk.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDupeAlt.setStyle(ButtonStyle.Success).setDisabled(true);
          btnDupePopbob.setStyle(ButtonStyle.Secondary).setDisabled(true);

          await btnInteraction.update({ embeds: [embed], components: [btnRow] }).catch(msgErrorHandler);

          await delay(3000);

          if (mathRandomInt(1, 6) === 1) {
            money = mathRandomInt(2000, 3000);

            if ((await manageUserMoney(client, message, "-", money)) === null) return;

            embed.setColor(0xff0000).setTitle("👮 Hausemaster Caught You").setDescription(`Hause saw you duping, and removed **${money}$** from your balance`);

            return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);
          }

          money = mathRandomInt(200, 300);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          embed.setColor(0x33ff33).setTitle("✅ Dupe Completed").setDescription(`You successfully did the dupe and got **${money}$**`);

          return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

        case "btn-dupe-btnDupePopbob":
          embed.setTitle("🖥️ You started doing *the* POPBOB DUPE :O").setDescription(null);

          btnDupeDonkey.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDupeChunk.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDupeAlt.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDupePopbob.setStyle(ButtonStyle.Success).setDisabled(true);

          await btnInteraction.update({ embeds: [embed], components: [btnRow] }).catch(msgErrorHandler);

          await delay(3000);

          money = mathRandomInt(300, 500);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          embed.setColor(0x33ff33).setTitle("✅ Ultimate Dupe Completed").setDescription(`"You successfully did the dupe and got **${money}$**"`);

          return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);
      }
    });

    btnCollector.on("end", async () => {
      if (!hasClickedBtn) {
        embed.setColor(0x000000).setTitle("No Response").setDescription("Soooo...no dupe? You missed the opportunity to get free money, well, you gotta wait now");

        btnDupeDonkey.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnDupeChunk.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnDupeAlt.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnDupePopbob.setStyle(ButtonStyle.Secondary).setDisabled(true);

        return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);
      }
    });
  },
};
