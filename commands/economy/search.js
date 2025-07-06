const { EmbedBuilder } = require("@discordjs/builders");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags, AttachmentBuilder } = require("discord.js");
const cooldownManager = require("../../utils/cooldownManager");
const manageUserMoney = require("../../utils/manageUserMoney");
const mathRandomInt = require("../../utils/mathRandomInt");
const delay = require("../../utils/delay");

module.exports = {
  name: "search",
  description: "Search around the Minecraft world for money",
  cooldown: 10800,
  async execute(client, message, args) {
    const cooldown = await cooldownManager(client, message, "searchCooldown", this.cooldown);
    if (cooldown == null) return;

    const embed = new EmbedBuilder();

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ Take a break from searching: **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    embed.setColor(0xff6600).setTitle("🔍 Base hunting time").setDescription("Choose the dimention you are going to explore for base hunting");

    const btnOverworld = new ButtonBuilder().setCustomId("btn-search-btnOverworld").setLabel("Overworld").setStyle(ButtonStyle.Primary);
    const btnNether = new ButtonBuilder().setCustomId("btn-search-btnNether").setLabel("Nether").setStyle(ButtonStyle.Primary);
    const btnEnd = new ButtonBuilder().setCustomId("btn-search-btnEnd").setLabel("End").setStyle(ButtonStyle.Primary);

    const btnRow = new ActionRowBuilder().addComponents(btnOverworld, btnNether, btnEnd);

    var sentMessage,
      money,
      searchProbs,
      hasClickedBtn = false;

    const imageFile = new AttachmentBuilder("./media/fitSmooth.gif");

    try {
      sentMessage = await message.reply({ embeds: [embed], components: [btnRow] });
    } catch (error) {
      return;
    }

    const btnCollector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    btnCollector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await btnInteraction.reply({ content: "This isn't your dooping button", flags: MessageFlags.Ephemeral });
        } catch (error) {
          return;
        }
      }

      hasClickedBtn = true;

      switch (btnInteraction.customId) {
        case "btn-search-btnOverworld":
          embed.setTitle("🔍 You start searching around the Overworld...").setDescription(null);

          btnOverworld.setStyle(ButtonStyle.Success).setDisabled(true);
          btnNether.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnEnd.setStyle(ButtonStyle.Secondary).setDisabled(true);

          try {
            await btnInteraction.update({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return;
          }

          await delay(3000);

          searchProbs = mathRandomInt(1, 10);

          switch (searchProbs) {
            case 1:
              embed.setColor(0xcc6600).setTitle("👀 You found a griefed zone").setDescription("There are some withers, random obsidian structures and ruins");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 2:
              embed.setColor(0xcc6600).setTitle("👀 You found a random structure").setDescription("Nothing of interesting, sadly no loot");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 3:
              embed.setColor(0xcc6600).setTitle("👀 You found a griefed stash").setDescription("Sadly all the shulker were gone and you got nothing");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 4:
              money = mathRandomInt(150, 250);
              if ((await manageUserMoney(client, message, "+", money)) == null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 YOU FOUND A BASE!!! OHH YEAH!!!")
                .setDescription("BUMP UP THE MUSIC!!! YOU FOUND A BASE!!! WOOOOOOO!!! You got **" + money + "$** 👏 🎵")
                .setImage("attachment://fitSmooth.gif");

              try {
                return await sentMessage.edit({ embeds: [embed], files: [imageFile] });
              } catch (error) {
                return;
              }

            case 5:
              money = mathRandomInt(70, 120);
              if ((await manageUserMoney(client, message, "+", money)) == null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 You found a griefed base")
                .setDescription("You found a griefed base with some shulkers, you got **" + money + "$** not lucky enough");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 6:
              money = mathRandomInt(100, 150);
              if ((await manageUserMoney(client, message, "+", money)) == null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 You found a dungeon")
                .setDescription("You found some shulker in it, you got **" + money + "$**, you can do better");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 7:
              money = mathRandomInt(200, 300);
              if ((await manageUserMoney(client, message, "+", money)) == null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("YOU FOUND A STASH BABYYY!!! 💰 💰 💰")
                .setDescription("You are really lucky, you got **" + money + "$**")
                .setImage("attachment://fitSmooth.gif");

              try {
                return await sentMessage.edit({ embeds: [embed], files: [imageFile] });
              } catch (error) {
                return;
              }

            default:
              embed.setColor(0xff0000).setTitle("❌ You found nothing").setDescription("Sadly you found nothing ;(");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }
          }

        case "btn-search-btnNether":
          embed.setTitle("🔍 You start searching around the Nether...").setDescription(null);

          btnOverworld.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnNether.setStyle(ButtonStyle.Success).setDisabled(true);
          btnEnd.setStyle(ButtonStyle.Secondary).setDisabled(true);

          try {
            await btnInteraction.update({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return;
          }

          await delay(3000);

          searchProbs = mathRandomInt(1, 10);

          switch (searchProbs) {
            case 1:
              embed.setColor(0xcc6600).setTitle("👀 You found a griefed zone").setDescription("There are some withers, random obsidian structures and ruins");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 2:
              embed.setColor(0xcc6600).setTitle("👀 You found a random structure").setDescription("Nothing of interesting, sadly no loot");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 3:
              embed.setColor(0xcc6600).setTitle("👀 You found a griefed stash").setDescription("Sadly all the shulker were gone and you got nothing");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 4:
              money = mathRandomInt(150, 250);
              if ((await manageUserMoney(client, message, "+", money)) == null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 YOU FOUND A BASE!!! OHH YEAH!!!")
                .setDescription("BUMP UP THE MUSIC!!! YOU FOUND A BASE!!! WOOOOOOO!!! You got **" + money + "$** 👏 🎵")
                .setImage("attachment://fitSmooth.gif");

              try {
                return await sentMessage.edit({ embeds: [embed], files: [imageFile] });
              } catch (error) {
                return;
              }

            case 5:
              money = mathRandomInt(70, 120);
              if ((await manageUserMoney(client, message, "+", money)) == null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 You found a griefed base")
                .setDescription("You found a griefed base with some shulkers, you got **" + money + "$** not lucky enough");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 6:
              money = mathRandomInt(100, 150);
              if ((await manageUserMoney(client, message, "+", money)) == null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 You found a dungeon")
                .setDescription("You found some shulker in it, you got **" + money + "$**, you can do better");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 7:
              money = mathRandomInt(200, 300);
              if ((await manageUserMoney(client, message, "+", money)) == null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("YOU FOUND A STASH BABYYY!!! 💰 💰 💰")
                .setDescription("You are really lucky, you got **" + money + "$**")
                .setImage("attachment://fitSmooth.gif");

              try {
                return await sentMessage.edit({ embeds: [embed], files: [imageFile] });
              } catch (error) {
                return;
              }

            default:
              embed.setColor(0xff0000).setTitle("❌ You found nothing").setDescription("Sadly you found nothing ;(");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }
          }

        case "btn-search-btnEnd":
          embed.setTitle("🔍 You start searching around the End...").setDescription(null);

          btnOverworld.setStyle(ButtonStyle.Success).setDisabled(true);
          btnNether.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnEnd.setStyle(ButtonStyle.Secondary).setDisabled(true);

          try {
            await btnInteraction.update({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return;
          }

          await delay(3000);

          searchProbs = mathRandomInt(1, 10);

          switch (searchProbs) {
            case 1:
              embed.setColor(0xcc6600).setTitle("👀 You found a griefed zone").setDescription("There are some withers, random obsidian structures and ruins");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 2:
              embed.setColor(0xcc6600).setTitle("👀 You found a random structure").setDescription("Nothing of interesting, sadly no loot");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 3:
              embed.setColor(0xcc6600).setTitle("👀 You found a griefed stash").setDescription("Sadly all the shulker were gone and you got nothing");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 4:
              money = mathRandomInt(150, 250);
              if ((await manageUserMoney(client, message, "+", money)) == null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 YOU FOUND A BASE!!! OHH YEAH!!!")
                .setDescription("BUMP UP THE MUSIC!!! YOU FOUND A BASE!!! WOOOOOOO!!! You got **" + money + "$** 👏 🎵")
                .setImage("attachment://fitSmooth.gif");

              try {
                return await sentMessage.edit({ embeds: [embed], files: [imageFile] });
              } catch (error) {
                return;
              }

            case 5:
              money = mathRandomInt(70, 120);
              if ((await manageUserMoney(client, message, "+", money)) == null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 You found a griefed base")
                .setDescription("You found a griefed base with some shulkers, you got **" + money + "$** not lucky enough");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 6:
              money = mathRandomInt(100, 150);
              if ((await manageUserMoney(client, message, "+", money)) == null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("👀 You found a dungeon")
                .setDescription("You found some shulker in it, you got **" + money + "$**, you can do better");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }

            case 7:
              money = mathRandomInt(200, 300);
              if ((await manageUserMoney(client, message, "+", money)) == null) return;

              embed
                .setColor(0xcc6600)
                .setTitle("YOU FOUND A STASH BABYYY!!! 💰 💰 💰")
                .setDescription("You are really lucky, you got **" + money + "$**")
                .setImage("attachment://fitSmooth.gif");

              try {
                return await sentMessage.edit({ embeds: [embed], files: [imageFile] });
              } catch (error) {
                return;
              }

            default:
              embed.setColor(0xff0000).setTitle("❌ You found nothing").setDescription("Sadly you found nothing ;(");

              try {
                return await sentMessage.edit({ embeds: [embed] });
              } catch (error) {
                return;
              }
          }
      }
    });

    btnCollector.on("end", async () => {
      if (!hasClickedBtn) {
        embed.setColor(0x000000).setTitle("Giving up").setDescription("Sooo you refuse to search? Well alright, you can do it later");

        btnOverworld.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnNether.setStyle(ButtonStyle.Secondary).setDisabled(true);
        btnEnd.setStyle(ButtonStyle.Secondary).setDisabled(true);

        try {
          return await sentMessage.edit({ embeds: [embed], components: [btnRow] });
        } catch (error) {
          return;
        }
      }
    });
  },
};
