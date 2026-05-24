const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags, AttachmentBuilder } = require("discord.js");
const cooldownManager = require("../../utils/cooldownManager");
const manageUserMoney = require("../../utils/manageUserMoney");
const mathRandomInt = require("../../utils/mathRandomInt");

module.exports = {
  name: "pm",
  aliases: ["postmeme"],
  description: "Post meme on Reddit",
  cooldown: 1800,
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const cooldown = await cooldownManager(client, message, "post_meme_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed.setColor(0x000000).setDescription("⏰ You can post another meme **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const imageFile = new AttachmentBuilder().setFile("./media/Reddit.png");

    embed
      .setColor(0x3366ff)
      .setTitle(message.author.username + " is going to post a meme")
      .setDescription("What type of meme are you planning to post?")
      .setThumbnail("attachment://Reddit.png");

    const btnFunny = new ButtonBuilder().setCustomId("btn-pm-btnFunny").setLabel("Funny").setStyle(ButtonStyle.Primary);
    const btnMeIrl = new ButtonBuilder().setCustomId("btn-pm-btnMeIrl").setLabel("Me_irl").setStyle(ButtonStyle.Primary);
    const btnClassic = new ButtonBuilder().setCustomId("btn-pm-btnClassic").setLabel("Classic").setStyle(ButtonStyle.Primary);
    const btnCopyPasta = new ButtonBuilder().setCustomId("btn-pm-btnCopyPasta").setLabel("Copy pasta").setStyle(ButtonStyle.Primary);
    const btnOld = new ButtonBuilder().setCustomId("btn-pm-btnOld").setLabel("Old").setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder().addComponents(btnFunny, btnMeIrl, btnClassic, btnCopyPasta, btnOld);

    let sentMessage;

    try {
      sentMessage = await message.reply({ embeds: [embed], components: [actionRow], files: [imageFile] });
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
          return await btnInteraction.reply({ content: "Don't steal his meme", flags: MessageFlags.Ephemeral });
        } catch {
          return;
        }
      }

      hasClickedBtn = true;

      switch (btnInteraction.customId) {
        case "btn-pm-btnFunny":
          btnFunny.setStyle(ButtonStyle.Success).setDisabled(true);
          btnMeIrl.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnClassic.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnCopyPasta.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnOld.setStyle(ButtonStyle.Secondary).setDisabled(true);

          if (mathRandomInt(1, 5) === 1) {
            imageFile.setFile("./media/Downvote.png");

            embed
              .setColor(0xff0000)
              .setTitle("👎 You posted a funny meme")
              .setDescription("That was a very cringe meme, downvoted for sure!")
              .setThumbnail("attachment://Downvote.png");

            try {
              return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
            } catch {
              return;
            }
          }

          money = mathRandomInt(50, 100);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          imageFile.setFile("./media/Upvote.png");

          embed
            .setColor(0x33cc00)
            .setTitle("👍 You posted a funny meme")
            .setDescription("Hahaha, nice meme there, you got **" + money + "$** for the content")
            .setThumbnail("attachment://Upvote.png");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
          } catch {
            return;
          }

        case "btn-pm-btnMeIrl":
          btnFunny.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnMeIrl.setStyle(ButtonStyle.Success).setDisabled(true);
          btnClassic.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnCopyPasta.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnOld.setStyle(ButtonStyle.Secondary).setDisabled(true);

          if (mathRandomInt(1, 5) === 1) {
            imageFile.setFile("./media/Downvote.png");

            embed.setColor(0xff0000).setTitle("👎 You posted a me_irl meme").setDescription("Nah! The meme wasn't realistic at all").setThumbnail("attachment://Downvote.png");

            try {
              return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
            } catch {
              return;
            }
          }

          money = mathRandomInt(50, 100);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          imageFile.setFile("./media/Upvote.png");

          embed
            .setColor(0x33cc00)
            .setTitle("👍 You posted a me_irl meme")
            .setDescription("It was a true meme and you got **" + money + "$** for that!")
            .setThumbnail("attachment://Upvote.png");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
          } catch {
            return;
          }

        case "btn-pm-btnClassic":
          btnFunny.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnMeIrl.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnClassic.setStyle(ButtonStyle.Success).setDisabled(true);
          btnCopyPasta.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnOld.setStyle(ButtonStyle.Secondary).setDisabled(true);

          if (mathRandomInt(1, 5) === 1) {
            imageFile.setFile("./media/Downvote.png");

            embed
              .setColor(0xff0000)
              .setTitle("👎 You posted a classic meme")
              .setDescription("This meme is not funny anymore, stop it")
              .setThumbnail("attachment://Downvote.png");

            try {
              return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
            } catch {
              return;
            }
          }

          money = mathRandomInt(50, 100);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          imageFile.setFile("./media/Upvote.png");

          embed
            .setColor(0x33cc00)
            .setTitle("👍 You posted a classic meme")
            .setDescription("Still a funny meme, you got **" + money + "$** for that!")
            .setThumbnail("attachment://Upvote.png");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
          } catch {
            return;
          }

        case "btn-pm-btnCopyPasta":
          btnFunny.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnMeIrl.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnClassic.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnCopyPasta.setStyle(ButtonStyle.Success).setDisabled(true);
          btnOld.setStyle(ButtonStyle.Secondary).setDisabled(true);

          if (mathRandomInt(1, 5) === 1) {
            imageFile.setFile("./media/Downvote.png");

            embed.setColor(0xff0000).setTitle("👎 You posted a copy pasta").setDescription("Stop copying this meme! It's cringe").setThumbnail("attachment://Downvote.png");

            try {
              return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
            } catch {
              return;
            }
          }

          money = mathRandomInt(50, 100);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          imageFile.setFile("./media/Upvote.png");

          embed
            .setColor(0x33cc00)
            .setTitle("👍 You posted a copy pasta")
            .setDescription("Lucky, nice meme, here **" + money + "$** for the not copied meme!")
            .setThumbnail("attachment://Upvote.png");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
          } catch {
            return;
          }

        case "btn-pm-btnOld":
          btnFunny.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnMeIrl.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnClassic.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnCopyPasta.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnOld.setStyle(ButtonStyle.Success).setDisabled(true);

          if (mathRandomInt(1, 5) === 1) {
            imageFile.setFile("./media/Downvote.png");

            embed
              .setColor(0xff0000)
              .setTitle("👎 You posted an old meme")
              .setDescription("Old memes are not funny, new memes are better!")
              .setThumbnail("attachment://Downvote.png");

            try {
              return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
            } catch {
              return;
            }
          }

          money = mathRandomInt(50, 100);

          if ((await manageUserMoney(client, message, "+", money)) === null) return;

          imageFile.setFile("./media/Upvote.png");

          embed
            .setColor(0x33cc00)
            .setTitle("👍 You posted an old meme")
            .setDescription("Old memes still funny, you got **" + money + "$**!")
            .setThumbnail("attachment://Upvote.png");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow], files: [imageFile] });
          } catch {
            return;
          }
      }
    });

    collector.on("end", async () => {
      if (!hasClickedBtn) {
        imageFile.setFile("./media/Reddit.png");

        embed.setTitle("🤷 Nothing to post").setDescription("I guess the meme you were about to post wasn't that good").setThumbnail("attachment://Reddit.png");

        btnFunny.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnMeIrl.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnClassic.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnCopyPasta.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnOld.setStyle(ButtonStyle.Secondary).setDisabled(true);

        try {
          return await sentMessage.edit({ embeds: [embed], components: [actionRow], files: [imageFile] });
        } catch {
          return;
        }
      }
    });
  },
};
