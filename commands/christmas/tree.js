const { EmbedBuilder } = require("discord.js");
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
        "SELECT treeLevel, twigs, leaves, decoid1, decoid2, decoid3, decoid4 FROM Event WHERE serverId = ? AND userId = ?",
        [message.guild.id, user.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!row) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Failed to load your Christmas tree from the database");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

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

        if (row.decoid1) {
          matrixForDecoratedTree[0][6] = "🌟";
        }

        if (row.decoid2) {
          matrixForDecoratedTree[3][3] = "🕯️";
          matrixForDecoratedTree[3][9] = "🕯️";
          matrixForDecoratedTree[5][2] = "🕯️";
          matrixForDecoratedTree[5][10] = "🕯️";
          matrixForDecoratedTree[7][1] = "🕯️";
          matrixForDecoratedTree[7][11] = "🕯️";
        }

        if (row.decoid3) {
          matrixForDecoratedTree[3][7] = "🔴";
          matrixForDecoratedTree[4][5] = "🟣";
          matrixForDecoratedTree[4][8] = "🔵";
          matrixForDecoratedTree[6][3] = "🔴";
          matrixForDecoratedTree[7][2] = "🟡";
          matrixForDecoratedTree[7][9] = "🟣";
          matrixForDecoratedTree[8][4] = "🔵";
          matrixForDecoratedTree[8][7] = "🟡";
        }

        if (row.decoid4) {
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
        break;
    }

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
