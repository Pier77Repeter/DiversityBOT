const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags, AttachmentBuilder } = require("discord.js");
const cooldownManager = require("../../utils/cooldownManager");
const manageUserMoney = require("../../utils/manageUserMoney");
const mathRandomInt = require("../../utils/mathRandomInt");
const listsGetRandomItem = require("../../utils/listsGetRandomItem");

module.exports = {
  name: "pv",
  aliases: ["postvideo"],
  description: "Post a video on YouTube",
  cooldown: 1800,
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const cooldown = await cooldownManager(client, message, "postVideoCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ You can publish another video in: **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const imageFile = new AttachmentBuilder().setFile("./media/YouTube.png");

    embed
      .setColor(0x3366ff)
      .setTitle(message.author.username + " is going to post a video")
      .setDescription("What type of video do you want to upload?")
      .setThumbnail("attachment://YouTube.png");

    const btnGaming = new ButtonBuilder().setCustomId("btn-pm-btnGaming").setLabel("Gaming").setStyle(ButtonStyle.Primary);
    const btnDocumentary = new ButtonBuilder().setCustomId("btn-pm-btnDocumentary").setLabel("Documentary").setStyle(ButtonStyle.Primary);
    const btnFunny = new ButtonBuilder().setCustomId("btn-pm-btnFunny").setLabel("Funny").setStyle(ButtonStyle.Primary);
    const btnTutorial = new ButtonBuilder().setCustomId("btn-pm-btnTutorial").setLabel("Tutorial").setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder().addComponents(btnGaming, btnDocumentary, btnFunny, btnTutorial);

    var sentMessage;

    try {
      sentMessage = await message.reply({ embeds: [embed], components: [actionRow], files: [imageFile] });
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
          return await btnInteraction.reply({ content: "Don't steal his YT content!", flags: MessageFlags.Ephemeral });
        } catch (error) {
          return;
        }
      }

      hasClickedBtn = true;

      switch (btnInteraction.customId) {
        case "btn-pm-btnGaming":
          btnGaming.setStyle(ButtonStyle.Success).setDisabled(true);
          btnDocumentary.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnFunny.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnTutorial.setStyle(ButtonStyle.Secondary).setDisabled(true);

          if (mathRandomInt(1, 5) == 1) {
            imageFile.setFile("./media/not_stonks.jpg");

            embed
              .setColor(0xff0000)
              .setTitle("👎 You posted a gaming video")
              .setDescription("The gameplay was soooo boring! You got nothing!")
              .setThumbnail("attachment://not_stonks.jpg");

            try {
              return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
            } catch (error) {
              return;
            }
          }

          money = mathRandomInt(50, 100);

          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          imageFile.setFile("./media/stonks.jpg");

          embed
            .setColor(0x33cc00)
            .setTitle("👍 You posted a gaming video")
            .setDescription(
              "Your video about: **" +
                listsGetRandomItem(["Minecraft", "Garry's Mod", "Roblox", "Sex with Stalin", "TF2", "GTA V", "Gen*shit* Impact"], false) +
                "** and you got **" +
                money +
                "$** for the content!"
            )
            .setThumbnail("attachment://stonks.jpg");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
          } catch (error) {
            return;
          }

        case "btn-pm-btnDocumentary":
          btnGaming.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDocumentary.setStyle(ButtonStyle.Success).setDisabled(true);
          btnFunny.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnTutorial.setStyle(ButtonStyle.Secondary).setDisabled(true);

          if (mathRandomInt(1, 5) == 1) {
            imageFile.setFile("./media/not_stonks.jpg");

            embed
              .setColor(0xff0000)
              .setTitle("👎 You posted a documentary video")
              .setDescription("The video was really boring, you got nothing!")
              .setThumbnail("attachment://not_stonks.jpg");

            try {
              return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
            } catch (error) {
              return;
            }
          }

          money = mathRandomInt(50, 100);

          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          imageFile.setFile("./media/stonks.jpg");

          embed
            .setColor(0x33cc00)
            .setTitle("👍 You posted a documentary video")
            .setDescription(
              "Your video about: **" +
                listsGetRandomItem(["History", "Science", "Geography", "Physics", "Psychology", "2b2t history", "Mechanics"], false) +
                "** and you got **" +
                money +
                "$** for the content!"
            )
            .setThumbnail("attachment://stonks.jpg");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
          } catch (error) {
            return;
          }

        case "btn-pm-btnFunny":
          btnGaming.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDocumentary.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnFunny.setStyle(ButtonStyle.Success).setDisabled(true);
          btnTutorial.setStyle(ButtonStyle.Secondary).setDisabled(true);

          if (mathRandomInt(1, 5) == 1) {
            imageFile.setFile("./media/not_stonks.jpg");

            embed
              .setColor(0xff0000)
              .setTitle("👎 You posted a funny video")
              .setDescription(
                "Brooo do you see what I see? No, this can't be real... Omg dude... Bro I think you just posted cringe bro. Smh. This is going to have consequences my friend. No, I'm not going to rape, torture or kill you and your family, even if i could do it. You gonna lose subscriber!!!! Bro you gonna lose subscriber. Don't you realize? You gonna lose subscriber! Go back to your cringe subscriber on cringe.com and cry like a cringe baby. Even your cringe subscriber are going to lose subscriber. That's how cringe you are. Have fun losing your fucking subscriber."
              )
              .setThumbnail("attachment://not_stonks.jpg");

            try {
              return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
            } catch (error) {
              return;
            }
          }

          money = mathRandomInt(50, 100);

          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          imageFile.setFile("./media/stonks.jpg");

          embed
            .setColor(0x33cc00)
            .setTitle("👍 You posted a funny video")
            .setDescription(
              "Your video about: **" +
                listsGetRandomItem(["Memes", "Funny Cats", "Funny Dogs", "Funny images", "Funny moments", "Trolls", "Funny people"], false) +
                "** and you got **" +
                money +
                "$** for the content!"
            )
            .setThumbnail("attachment://stonks.jpg");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
          } catch (error) {
            return;
          }

        case "btn-pm-btnTutorial":
          btnGaming.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDocumentary.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnFunny.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnTutorial.setStyle(ButtonStyle.Success).setDisabled(true);

          if (mathRandomInt(1, 5) == 1) {
            imageFile.setFile("./media/not_stonks.jpg");

            embed
              .setColor(0xff0000)
              .setTitle("👎 You posted a tutorial video")
              .setDescription("The tutorial was useless and hard to understand, you got nothing!")
              .setThumbnail("attachment://not_stonks.jpg");

            try {
              return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
            } catch (error) {
              return;
            }
          }

          money = mathRandomInt(50, 100);

          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          imageFile.setFile("./media/stonks.jpg");

          embed
            .setColor(0x33cc00)
            .setTitle("👍 You posted a tutorial video")
            .setDescription(
              "Your video about: **" +
                listsGetRandomItem(
                  [
                    "How to build an house in Minecraft",
                    "How to DoS with Paint",
                    "How to install Win10",
                    "How to fly",
                    "How to Alt F4 on your teacher",
                    "How to copy homeworks",
                    "How to teleport in real life",
                  ],
                  false
                ) +
                "** and you got **" +
                money +
                "$** for the content!"
            )
            .setThumbnail("attachment://stonks.jpg");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
          } catch (error) {
            return;
          }
      }
    });

    collector.on("end", async () => {
      if (!hasClickedBtn) {
        imageFile.setFile("./media/YouTube.png");

        embed
          .setTitle("🤷 Nothing to post")
          .setDescription("Out of ideas? Can happen, take your time to think for an original video")
          .setThumbnail("attachment://YouTube.png");

        btnGaming.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnDocumentary.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnFunny.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnTutorial.setStyle(ButtonStyle.Secondary).setDisabled(true);

        try {
          return await sentMessage.edit({ embeds: [embed], components: [actionRow], files: [imageFile] });
        } catch (error) {
          return;
        }
      }
    });
  },
};
