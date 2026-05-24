const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags } = require("discord.js");
const cooldownManager = require("../../utils/cooldownManager");
const manageUserMoney = require("../../utils/manageUserMoney");
const mathRandomInt = require("../../utils/mathRandomInt");

module.exports = {
  name: "hl",
  aliases: ["highlow"],
  description: "Play the high low game",
  cooldown: 900,
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const cooldown = await cooldownManager(client, message, "high_low_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed.setColor(0x000000).setDescription("⏰ You can play this game in **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    let highLowNumber = mathRandomInt(1, 100),
      highLowSelectedNumber = mathRandomInt(1, 100);

    embed
      .setColor(0x3366ff)
      .setTitle("🔢 Will the next number be higher or lower?")
      .setDescription("The number selected is **" + highLowNumber + "**!");

    const btnLow = new ButtonBuilder().setCustomId("btn-hl-btnLow").setLabel("Low").setStyle(ButtonStyle.Primary);
    const btnHigh = new ButtonBuilder().setCustomId("btn-hl-btnHigh").setLabel("High").setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder().addComponents(btnLow, btnHigh);

    let sentMessage;

    try {
      sentMessage = await message.reply({ embeds: [embed], components: [actionRow] });
    } catch {
      return;
    }

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    let money,
      hasClickedBtn = false;

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await btnInteraction.reply({
            content: "It's not your game",
            flags: MessageFlags.Ephemeral,
          });
        } catch {
          return;
        }
      }

      hasClickedBtn = true;

      switch (btnInteraction.customId) {
        case "btn-hl-btnLow":
          btnLow.setStyle(ButtonStyle.Success).setDisabled(true);
          btnHigh.setStyle(ButtonStyle.Secondary).setDisabled(true);

          if (highLowSelectedNumber > highLowNumber) {
            embed
              .setColor(0xff0000)
              .setTitle("❌ Wrong")
              .setDescription("The selected number was **" + highLowSelectedNumber + "**");

            try {
              return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
            } catch {
              return;
            }
          }

          money = mathRandomInt(30, 80);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("✅ That's right")
            .setDescription("The number selected was **" + highLowSelectedNumber + "** and you won **" + money + "$**!");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch {
            return;
          }

        case "btn-hl-btnHigh":
          btnLow.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnHigh.setStyle(ButtonStyle.Success).setDisabled(true);

          if (highLowSelectedNumber < highLowNumber) {
            embed
              .setColor(0xff0000)
              .setTitle("❌ Wrong")
              .setDescription("The selected number was **" + highLowSelectedNumber + "**");

            try {
              return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
            } catch {
              return;
            }
          }

          money = mathRandomInt(30, 80);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("✅ That's right")
            .setDescription("The number selected was **" + highLowSelectedNumber + "** and you won **" + money + "$**!");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch {
            return;
          }
      }
    });

    collector.on("end", async () => {
      if (!hasClickedBtn) {
        embed.setTitle("🔢 Nothing").setDescription("Don't want to play? Alright, then");

        btnLow.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnHigh.setStyle(ButtonStyle.Secondary).setDisabled(true);

        try {
          return await sentMessage.edit({ embeds: [embed], components: [actionRow] });
        } catch {
          return;
        }
      }
    });
  },
};
