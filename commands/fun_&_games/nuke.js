const { EmbedBuilder, ButtonStyle, MessageFlags, ComponentType, AttachmentBuilder } = require("discord.js");
const { ButtonBuilder } = require("@discordjs/builders");
const { ActionRowBuilder } = require("@discordjs/builders");
const delay = require("../../utils/delay");
const cooldownManager = require("../../utils/cooldownManager");

module.exports = {
  name: "nuke",
  description: "Nuke the chat or a specific user",
  cooldown: 30,
  async execute(client, message, args) {
    try {
      if (!args[0]) return await message.reply("You need to specify a location to nuke");
    } catch (error) {
      return;
    }

    const embed = new EmbedBuilder();

    const cooldown = await cooldownManager(client, message, "nukeCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ No need to nuke this fast, another nuke will be ready **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const target = message.mentions.members.first() ? message.mentions.members.first().user.username : args[0];

    embed
      .setColor(0x14141f)
      .setTitle("🚀 ICBM control panel")
      .setDescription("Target location: " + target)
      .setTimestamp()
      .setThumbnail("https://c.tenor.com/8Juj0k-1L4AAAAAC/tenor.gif")
      .setFooter({
        text: "Waiting launch approval",
      });

    const btnConfirmLaunch = new ButtonBuilder().setCustomId("btn-nuke-confirmLaunch").setLabel("✅ Confirm launch").setStyle(ButtonStyle.Danger);
    const btnCancelLaunch = new ButtonBuilder().setCustomId("btn-nuke-cancelLaunch").setLabel("❌ Cancel launch").setStyle(ButtonStyle.Success);
    const btnRow = new ActionRowBuilder().addComponents(btnConfirmLaunch, btnCancelLaunch);

    var sentMessage;
    try {
      sentMessage = await message.reply({ embeds: [embed], components: [btnRow] });
    } catch (error) {
      return;
    }

    const btnCollector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    var hasUserClickedBtn = false;

    btnCollector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await btnInteraction.reply({
            content: "You can't launch this nuke, it's for someone else",
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          return;
        }
      }

      switch (btnInteraction.customId) {
        case "btn-nuke-confirmLaunch":
          hasUserClickedBtn = true;

          btnConfirmLaunch.setDisabled(true);
          btnCancelLaunch.setDisabled(true);

          embed
            .setColor(0xff3300)
            .setDescription("Launching nuke towards: " + target)
            .setThumbnail()
            .setFooter({
              text: "Initiating nuke launch",
            });

          try {
            await btnInteraction.update({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return;
          }

          await delay(2000);

          embed.setDescription(["Launching nuke towards: " + target, "\n", "**5...**"].join(""));

          try {
            await sentMessage.edit({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return;
          }

          await delay(1000);

          embed.setDescription(["Launching nuke towards: " + target, "\n", "**4...**"].join(""));

          try {
            await sentMessage.edit({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return;
          }

          await delay(1000);

          embed.setDescription(["Launching nuke towards: " + target, "\n", "**3...**"].join(""));

          try {
            await sentMessage.edit({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return;
          }

          await delay(1000);

          embed.setDescription(["Launching nuke towards: " + target, "\n", "**2...**"].join(""));

          try {
            await sentMessage.edit({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return;
          }

          await delay(1000);

          embed.setDescription(["Launching nuke towards: " + target, "\n", "**1...**"].join(""));

          try {
            await sentMessage.edit({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return;
          }

          await delay(1000);

          embed.setDescription("🚀🚀🚀 Nuke is flying towards: " + target);
          embed.setImage("https://c.tenor.com/I2ZKnQpI2GcAAAAd/tenor.gif");

          try {
            await sentMessage.edit({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return;
          }

          await delay(5000);

          embed
            .setColor(0xcc0000)
            .setTitle(message.author.username + " WHAT HAVE YOU DONE?!")
            .setDescription(target + " has been nuked with extreme success!")
            .setThumbnail()
            .setImage("https://c.tenor.com/E8m5PNgADeYAAAAC/tenor.gif")
            .setTimestamp()
            .setFooter({ text: "Launch completed" });

          try {
            await sentMessage.edit({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return;
          }

          btnCollector.stop();
          break;

        case "btn-nuke-cancelLaunch":
          hasUserClickedBtn = true;

          const imageFile = new AttachmentBuilder("./media/thumbsUpEmoji.jpg");

          btnConfirmLaunch.setDisabled(true);
          btnCancelLaunch.setDisabled(true);

          embed
            .setColor(0x33cc00)
            .setDescription("Nuke launch failed, " + target + " is safe :P")
            .setThumbnail()
            .setImage("attachment://thumbsUpEmoji.jpg")
            .setFooter({ text: "Launch cancelled" });

          try {
            await btnInteraction.update({ embeds: [embed], files: [imageFile], components: [btnRow] });
          } catch (error) {
            return;
          }

          btnCollector.stop();
          break;
      }
    });

    btnCollector.on("end", async () => {
      if (!hasUserClickedBtn) {
        embed.setColor(0x33cc00).setDescription("Nuke launch has been terminated, no answer received").setThumbnail().setFooter({ text: "Launch failed" });

        btnConfirmLaunch.setDisabled(true);
        btnCancelLaunch.setDisabled(true);

        try {
          return await sentMessage.edit({ embeds: [embed], components: [btnRow] });
        } catch (error) {
          return;
        }
      }

      return;
    });
  },
};
