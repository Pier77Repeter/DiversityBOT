const { EmbedBuilder } = require("@discordjs/builders");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags, AttachmentBuilder } = require("discord.js");
const path = require("path");
const cooldownManager = require("../../utils/cooldownManager");
const manageUserMoney = require("../../utils/manageUserMoney");
const mathRandomInt = require("../../utils/mathRandomInt");
const delay = require("../../utils/delay");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "search",
  description: "Search around the Minecraft world for money",
  cooldown: 10800,
  async execute(client, message, args) {
    const cooldown = await cooldownManager(client, message, "search_cooldown", this.cooldown);
    if (cooldown === null) return;

    const embed = new EmbedBuilder();

    if (cooldown) {
      embed.setColor(0x000000).setDescription("⏰ Take a break from searching, come back **<t:" + cooldown[1] + ":R>**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    embed.setColor(0xff6600).setTitle("🔍 Base hunting time").setDescription("Choose the dimention you are going to explore for base hunting");

    const btnOverworld = new ButtonBuilder().setCustomId("btn-search-btnOverworld").setLabel("Overworld").setStyle(ButtonStyle.Primary);
    const btnNether = new ButtonBuilder().setCustomId("btn-search-btnNether").setLabel("Nether").setStyle(ButtonStyle.Primary);
    const btnEnd = new ButtonBuilder().setCustomId("btn-search-btnEnd").setLabel("End").setStyle(ButtonStyle.Primary);

    const btnRow = new ActionRowBuilder().addComponents(btnOverworld, btnNether, btnEnd);

    let money,
      searchProbs,
      hasClickedBtn = false;

    const imageFile = new AttachmentBuilder(path.join(process.cwd(), "media", "fitSmooth.gif"), { name: "fitSmooth.gif" });

    const sentMessage = await message.reply({ embeds: [embed], components: [btnRow] }).catch(msgErrorHandler);
    if (!sentMessage) return;

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
        case "btn-search-btnOverworld":
          embed.setTitle("🔍 You start searching around the Overworld...").setDescription(null);

          btnOverworld.setStyle(ButtonStyle.Success).setDisabled(true);
          btnNether.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnEnd.setStyle(ButtonStyle.Secondary).setDisabled(true);

          // can't 1-line it >:(
          try {
            await btnInteraction.update({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return msgErrorHandler(error);
          }

          await delay(3000);

          searchProbs = mathRandomInt(1, 10);

          switch (searchProbs) {
            case 1:
              embed.setColor(0xcc6600).setTitle("👀 You found a griefed zone").setDescription("There are some withers, random obsidian structures and ruins");
              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 2:
              embed.setColor(0xcc6600).setTitle("👀 You found a random structure").setDescription("Nothing of interesting, sadly no loot");
              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 3:
              embed.setColor(0xcc6600).setTitle("👀 You found a griefed stash").setDescription("Sadly all the shulker were gone and you got nothing");
              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 4:
              money = mathRandomInt(150, 250);
              if ((await manageUserMoney(client, message, "+", money)) === null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 YOU FOUND A BASE!!! OHH YEAH!!!")
                .setDescription("BUMP UP THE MUSIC!!! YOU FOUND A BASE!!! WOOOOOOO!!! You got **" + money + "$** 👏 🎵")
                .setImage("attachment://fitSmooth.gif");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 5:
              money = mathRandomInt(70, 120);
              if ((await manageUserMoney(client, message, "+", money)) === null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 You found a griefed base")
                .setDescription("You found a griefed base with some shulkers, you got **" + money + "$** not lucky enough");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 6:
              money = mathRandomInt(100, 150);
              if ((await manageUserMoney(client, message, "+", money)) === null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 You found a dungeon")
                .setDescription("You found some shulker in it, you got **" + money + "$**, you can do better");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 7:
              money = mathRandomInt(200, 300);
              if ((await manageUserMoney(client, message, "+", money)) === null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("YOU FOUND A STASH BABYYY!!! 💰 💰 💰")
                .setDescription("You are really lucky, you got **" + money + "$**")
                .setImage("attachment://fitSmooth.gif");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            default:
              embed.setColor(0xff0000).setTitle("❌ You found nothing").setDescription("Sadly you found nothing ;(");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);
          }

        case "btn-search-btnNether":
          embed.setTitle("🔍 You start searching around the Nether...").setDescription(null);

          btnOverworld.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnNether.setStyle(ButtonStyle.Success).setDisabled(true);
          btnEnd.setStyle(ButtonStyle.Secondary).setDisabled(true);

          try {
            await btnInteraction.update({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return msgErrorHandler(error);
          }

          await delay(3000);

          searchProbs = mathRandomInt(1, 10);

          switch (searchProbs) {
            case 1:
              embed.setColor(0xcc6600).setTitle("👀 You found a griefed zone").setDescription("There are some withers, random obsidian structures and ruins");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 2:
              embed.setColor(0xcc6600).setTitle("👀 You found a random structure").setDescription("Nothing of interesting, sadly no loot");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 3:
              embed.setColor(0xcc6600).setTitle("👀 You found a griefed stash").setDescription("Sadly all the shulker were gone and you got nothing");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 4:
              money = mathRandomInt(150, 250);
              if ((await manageUserMoney(client, message, "+", money)) === null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 YOU FOUND A BASE!!! OHH YEAH!!!")
                .setDescription("BUMP UP THE MUSIC!!! YOU FOUND A BASE!!! WOOOOOOO!!! You got **" + money + "$** 👏 🎵")
                .setImage("attachment://fitSmooth.gif");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 5:
              money = mathRandomInt(70, 120);
              if ((await manageUserMoney(client, message, "+", money)) === null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 You found a griefed base")
                .setDescription("You found a griefed base with some shulkers, you got **" + money + "$** not lucky enough");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 6:
              money = mathRandomInt(100, 150);
              if ((await manageUserMoney(client, message, "+", money)) === null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 You found a dungeon")
                .setDescription("You found some shulker in it, you got **" + money + "$**, you can do better");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 7:
              money = mathRandomInt(200, 300);
              if ((await manageUserMoney(client, message, "+", money)) === null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("YOU FOUND A STASH BABYYY!!! 💰 💰 💰")
                .setDescription("You are really lucky, you got **" + money + "$**")
                .setImage("attachment://fitSmooth.gif");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            default:
              embed.setColor(0xff0000).setTitle("❌ You found nothing").setDescription("Sadly you found nothing ;(");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);
          }

        case "btn-search-btnEnd":
          embed.setTitle("🔍 You start searching around the End...").setDescription(null);

          btnOverworld.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnNether.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnEnd.setStyle(ButtonStyle.Success).setDisabled(true);

          try {
            await btnInteraction.update({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return msgErrorHandler(error);
          }

          await delay(3000);

          searchProbs = mathRandomInt(1, 10);

          switch (searchProbs) {
            case 1:
              embed.setColor(0xcc6600).setTitle("👀 You found a griefed zone").setDescription("There are some withers, random obsidian structures and ruins");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 2:
              embed.setColor(0xcc6600).setTitle("👀 You found a random structure").setDescription("Nothing of interesting, sadly no loot");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 3:
              embed.setColor(0xcc6600).setTitle("👀 You found a griefed stash").setDescription("Sadly all the shulker were gone and you got nothing");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 4:
              money = mathRandomInt(150, 250);
              if ((await manageUserMoney(client, message, "+", money)) === null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 YOU FOUND A BASE!!! OHH YEAH!!!")
                .setDescription("BUMP UP THE MUSIC!!! YOU FOUND A BASE!!! WOOOOOOO!!! You got **" + money + "$** 👏 🎵")
                .setImage("attachment://fitSmooth.gif");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 5:
              money = mathRandomInt(70, 120);
              if ((await manageUserMoney(client, message, "+", money)) === null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 You found a griefed base")
                .setDescription("You found a griefed base with some shulkers, you got **" + money + "$** not lucky enough");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 6:
              money = mathRandomInt(100, 150);
              if ((await manageUserMoney(client, message, "+", money)) === null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 You found a dungeon")
                .setDescription("You found some shulker in it, you got **" + money + "$**, you can do better");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            case 7:
              money = mathRandomInt(200, 300);
              if ((await manageUserMoney(client, message, "+", money)) === null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("YOU FOUND A STASH BABYYY!!! 💰 💰 💰")
                .setDescription("You are really lucky, you got **" + money + "$**")
                .setImage("attachment://fitSmooth.gif");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);

            default:
              embed.setColor(0xff0000).setTitle("❌ You found nothing").setDescription("Sadly you found nothing ;(");

              return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);
          }
      }
    });

    btnCollector.on("end", async () => {
      if (!hasClickedBtn) {
        embed.setColor(0x000000).setTitle("🤷‍♂️ Giving Up").setDescription("Sooo you refuse to search? Well alright, you can do it later");

        btnOverworld.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnNether.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnEnd.setStyle(ButtonStyle.Secondary).setDisabled(true);

        return await sentMessage.edit({ embeds: [embed], components: [btnRow] }).catch(msgErrorHandler);
      }
    });
  },
};
