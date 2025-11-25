const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType, MessageFlags, ButtonStyle } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "tree",
  description: "Displays user Christmas tree",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isEventEnabled = await configChecker(client, message, "eventCmd");
    if (isEventEnabled == null) return;

    if (!isEventEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Event commands are off! Type **d!setup event** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT treeLevel, twigs, leaves, decoId1, decoId2, decoId3, decoId4 FROM Event WHERE serverId = ? AND userId = ?",
        [message.guild.id, user.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!row) {
      embed.setColor(0xff0000).setTitle("😥 Very very sad").setDescription("It seems like the user dosen't know i exist and won't build his tree");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const btnUpgrade = new ButtonBuilder().setCustomId("btn-tree-btnUpgrade").setLabel("Upgrade tree").setStyle("Primary");
    const actionRow = new ActionRowBuilder().addComponents(btnUpgrade);

    switch (row.treeLevel) {
      case 0:
        embed
          .setColor(0x339999)
          .setTitle("🎄 " + user.username + "'s Christmas tree")
          .setDescription(
            `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`
          )
          .setFooter({ text: "Empty tree, start collecting materials with d!forest" });
        break;
      case 1:
        embed
          .setColor(0x339999)
          .setTitle("🎄 " + user.username + "'s Christmas tree")
          .setDescription(
            `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`
          )
          .setFooter({ text: "Christmas tree level 1/5" });
        break;
      case 2:
        embed
          .setColor(0x339999)
          .setTitle("🎄 " + user.username + "'s Christmas tree")
          .setDescription(
            `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛🟫🟫🟫🟫🟫🟫🟫⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`
          )
          .setFooter({ text: "Christmas tree level 2/5" });
        break;
      case 3:
        embed
          .setColor(0x339999)
          .setTitle("🎄 " + user.username + "'s Christmas tree")
          .setDescription(
            `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛🟫🟫🟫⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛🟫🟫🟫🟫🟫🟫🟫⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`
          )
          .setFooter({ text: "Christmas tree level 3/5" });
        break;
      case 4:
        embed
          .setColor(0x339999)
          .setTitle("🎄 " + user.username + "'s Christmas tree")
          .setDescription(
            `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛🟩⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛🟩🟫🟩⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛🟩🟫🟫🟫🟩⬛⬛⬛⬛
            ⬛⬛⬛🟩🟩🟩🟫🟩🟩🟩⬛⬛⬛
            ⬛⬛⬛🟩🟫🟫🟫🟫🟫🟩⬛⬛⬛
            ⬛⬛🟩🟩🟩🟩🟫🟩🟩🟩🟩⬛⬛
            ⬛⬛🟩🟫🟫🟫🟫🟫🟫🟫🟩⬛⬛
            ⬛🟩🟩🟩🟩🟩🟫🟩🟩🟩🟩🟩⬛
            ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`
          )
          .setFooter({ text: "Christmas tree level 4/5" });
        break;
      case 5:
        const matrixForDecoratedTree = [
          ["⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛"],
          ["⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "🟩", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛"],
          ["⬛", "⬛", "⬛", "⬛", "⬛", "🟩", "🟩", "🟩", "⬛", "⬛", "⬛", "⬛", "⬛"],
          ["⬛", "⬛", "⬛", "⬛", "🟩", "🟩", "🟩", "🟩", "🟩", "⬛", "⬛", "⬛", "⬛"],
          ["⬛", "⬛", "⬛", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "⬛", "⬛", "⬛"],
          ["⬛", "⬛", "⬛", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "⬛", "⬛", "⬛"],
          ["⬛", "⬛", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "⬛", "⬛"],
          ["⬛", "⬛", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "⬛", "⬛"],
          ["⬛", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "⬛"],
          ["⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "🟫", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛"],
          ["⬛", "⬛", "⬛", "⬛", "🟫", "🟫", "🟫", "🟫", "🟫", "⬛", "⬛", "⬛", "⬛"],
        ];

        if (row.decoId1) {
          matrixForDecoratedTree[0][6] = "🌟";
        }

        if (row.decoId2) {
          matrixForDecoratedTree[3][3] = "🕯️";
          matrixForDecoratedTree[3][9] = "🕯️";
          matrixForDecoratedTree[5][2] = "🕯️";
          matrixForDecoratedTree[5][10] = "🕯️";
          matrixForDecoratedTree[7][1] = "🕯️";
          matrixForDecoratedTree[7][11] = "🕯️";
        }

        if (row.decoId3) {
          matrixForDecoratedTree[3][7] = "🔴";
          matrixForDecoratedTree[4][5] = "🟣";
          matrixForDecoratedTree[4][8] = "🔵";
          matrixForDecoratedTree[6][3] = "🔴";
          matrixForDecoratedTree[7][2] = "🟡";
          matrixForDecoratedTree[7][9] = "🟣";
          matrixForDecoratedTree[8][4] = "🔵";
          matrixForDecoratedTree[8][7] = "🟡";
        }

        if (row.decoId4) {
          matrixForDecoratedTree[2][5] = "🟪";
          matrixForDecoratedTree[2][6] = "🟪";
          matrixForDecoratedTree[3][4] = "🟧";
          matrixForDecoratedTree[3][5] = "🟧";
          matrixForDecoratedTree[4][6] = "🟧";
          matrixForDecoratedTree[4][7] = "🟧";
          matrixForDecoratedTree[5][4] = "🟦";
          matrixForDecoratedTree[5][3] = "🟦";
          matrixForDecoratedTree[5][8] = "🟧";
          matrixForDecoratedTree[5][9] = "🟧";
          matrixForDecoratedTree[6][5] = "🟦";
          matrixForDecoratedTree[6][6] = "🟦";
          matrixForDecoratedTree[6][7] = "🟥";
          matrixForDecoratedTree[6][8] = "🟥";
          matrixForDecoratedTree[6][9] = "🟥";
          matrixForDecoratedTree[7][4] = "🟥";
          matrixForDecoratedTree[7][5] = "🟥";
          matrixForDecoratedTree[7][6] = "🟥";
          matrixForDecoratedTree[7][8] = "🟦";
          matrixForDecoratedTree[7][7] = "🟦";
          matrixForDecoratedTree[8][1] = "🟥";
          matrixForDecoratedTree[8][2] = "🟥";
          matrixForDecoratedTree[8][3] = "🟥";
          matrixForDecoratedTree[8][9] = "🟦";
          matrixForDecoratedTree[8][10] = "🟦";
        }

        const embedDescription = matrixForDecoratedTree.map((row) => row.join("")).join("\n");

        embed
          .setColor(0x339999)
          .setTitle("🎄 " + user.username + "'s Christmas tree")
          .setDescription(embedDescription);

        btnUpgrade.setLabel("Upgrade tree").setStyle("Secondary").setDisabled(true);
        break;
    }

    var sentMessage;

    try {
      sentMessage = await message.reply({ embeds: [embed], components: [actionRow] });
    } catch (error) {
      return;
    }

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await btnInteraction.reply({
            content: "This upgrade isn't for you bruh",
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          return;
        }
      }

      if (btnInteraction.customId == "btn-tree-btnUpgrade") {
        switch (row.treeLevel) {
          case 0:
            if (row.twigs < 50 || row.leaves < 50) {
              embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need at least **50 twigs** and **50 leaves** to upgrade your tree");

              btnUpgrade.setStyle(ButtonStyle.Secondary).setDisabled(true);

              try {
                return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
              } catch (error) {
                return;
              }
            }

            await new Promise((resolve, reject) => {
              client.database.run(
                "UPDATE Event SET treeLevel = 1, twigs = twigs - 50, leaves = leaves - 50 WHERE serverId = ? AND userId = ?",
                [message.guild.id, message.author.id],
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });

            embed
              .setColor(0x339999)
              .setTitle("🎄 " + user.username + "'s tree got upgraded!")
              .setDescription(
                `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`
              )
              .setFooter({ text: "Christmas tree level 1/5" });

            break;
          case 1:
            if (row.twigs < 100 || row.leaves < 100) {
              embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need at least **100 twigs** and **100 leaves** to upgrade your tree");

              btnUpgrade.setStyle(ButtonStyle.Secondary).setDisabled(true);

              try {
                return await sentMessage.edit({ embeds: [embed], components: [actionRow] });
              } catch (error) {
                return;
              }
            }

            await new Promise((resolve, reject) => {
              client.database.run(
                "UPDATE Event SET treeLevel = 2, twigs = twigs - 100, leaves = leaves - 100 WHERE serverId = ? AND userId = ?",
                [message.guild.id, message.author.id],
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });

            embed
              .setColor(0x339999)
              .setTitle("🎄 " + user.username + "'s tree got upgraded!")
              .setDescription(
                `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛🟫🟫🟫🟫🟫🟫🟫⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`
              )
              .setFooter({ text: "Christmas tree level 2/5" });

            break;
          case 2:
            if (row.twigs < 150 || row.leaves < 200) {
              embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need at least **150 twigs** and **200 leaves** to upgrade your tree");

              btnUpgrade.setStyle(ButtonStyle.Secondary).setDisabled(true);

              try {
                return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
              } catch (error) {
                return;
              }
            }

            await new Promise((resolve, reject) => {
              client.database.run(
                "UPDATE Event SET treeLevel = 3, twigs = twigs - 150, leaves = leaves - 200 WHERE serverId = ? AND userId = ?",
                [message.guild.id, message.author.id],
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });

            embed
              .setColor(0x339999)
              .setTitle("🎄 " + user.username + "'s tree got upgraded!")
              .setDescription(
                `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛🟫🟫🟫⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛🟫🟫🟫🟫🟫🟫🟫⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`
              )
              .setFooter({ text: "Christmas tree level 3/5" });

            break;
          case 3:
            if (row.twigs < 200 || row.leaves < 300) {
              embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need at least **200 twigs** and **300 leaves** to upgrade your tree");

              btnUpgrade.setStyle(ButtonStyle.Secondary).setDisabled(true);

              try {
                return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
              } catch (error) {
                return;
              }
            }

            await new Promise((resolve, reject) => {
              client.database.run(
                "UPDATE Event SET treeLevel = 4, twigs = twigs - 200, leaves = leaves - 300 WHERE serverId = ? AND userId = ?",
                [message.guild.id, message.author.id],
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });

            embed
              .setColor(0x339999)
              .setTitle("🎄 " + user.username + "'s tree got upgraded!")
              .setDescription(
                `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛🟩⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛🟩🟫🟩⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛🟩🟫🟫🟫🟩⬛⬛⬛⬛
                ⬛⬛⬛🟩🟩🟩🟫🟩🟩🟩⬛⬛⬛
                ⬛⬛⬛🟩🟫🟫🟫🟫🟫🟩⬛⬛⬛
                ⬛⬛🟩🟩🟩🟩🟫🟩🟩🟩🟩⬛⬛
                ⬛⬛🟩🟫🟫🟫🟫🟫🟫🟫🟩⬛⬛
                ⬛🟩🟩🟩🟩🟩🟫🟩🟩🟩🟩🟩⬛
                ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`
              )
              .setFooter({ text: "Christmas tree level 4/5" });

            break;
          case 4:
            if (row.twigs < 300 || row.leaves < 500) {
              embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need at least **300 twigs** and **500 leaves** to upgrade your tree");

              btnUpgrade.setStyle(ButtonStyle.Secondary).setDisabled(true);

              try {
                return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
              } catch (error) {
                return;
              }
            }

            await new Promise((resolve, reject) => {
              client.database.run(
                "UPDATE Event SET treeLevel = 5, twigs = twigs - 300, leaves = leaves - 500 WHERE serverId = ? AND userId = ?",
                [message.guild.id, message.author.id],
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });

            embed
              .setColor(0x339999)
              .setTitle("🎄🎄🎄 " + user.username + "'s tree got MAXED!")
              .setDescription(
                `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛⬛🟩⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛⬛🟩🟩🟩⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛🟩🟩🟩🟩🟩⬛⬛⬛⬛
                ⬛⬛⬛🟩🟩🟩🟩🟩🟩🟩⬛⬛⬛
                ⬛⬛⬛🟩🟩🟩🟩🟩🟩🟩⬛⬛⬛
                ⬛⬛🟩🟩🟩🟩🟩🟩🟩🟩🟩⬛⬛
                ⬛⬛🟩🟩🟩🟩🟩🟩🟩🟩🟩⬛⬛
                ⬛🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩⬛
                ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
                ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`
              )
              .setFooter({ text: "Christmas has been completed!" });

            break;
        }

        btnUpgrade.setStyle(ButtonStyle.Secondary).setDisabled(true);

        try {
          return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
        } catch (error) {
          return;
        }
      }
    });

    collector.on("end", async () => {
      btnUpgrade.setStyle(ButtonStyle.Secondary).setDisabled(true);

      try {
        return await sentMessage.edit({ embeds: [embed], components: [actionRow] });
      } catch (error) {
        return;
      }
    });
  },
};
