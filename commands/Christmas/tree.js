const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType, MessageFlags, ButtonStyle } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "tree",
  description: "Displays user Christmas tree",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isEventEnabled = await configChecker(client, message, "event_cmd");
    if (isEventEnabled === null) return;

    if (!isEventEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Event commands are off! Type **d!setup event** to enable them");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const res = await client.database.query("SELECT tree_level, twigs, leaves, deco_id1, deco_id2, deco_id3, deco_id4 FROM events WHERE server_id = $1 AND user_id = $2", [
      message.guildId,
      user.id,
    ]);

    const row = res.rows[0];

    const date = new Date();
    // getMonth() starts from 0 and goes to 11, so the month 11 is December
    const isChristmasSeason = date.getMonth() === 11 && date.getDate() <= 25 ? true : false;

    if (!row) {
      embed.setColor(0xff0000).setTitle("😥 Very Very Sad");

      if (isChristmasSeason) {
        embed.setDescription("It seems like the user dosen't know i exist and won't build his tree");
      } else {
        embed.setDescription("It seems like the user dosen't know i exist and didn't build his tree!");
      }

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (isChristmasSeason) {
      switch (row.tree_level) {
        case 0:
          embed
            .setColor(0x339999)
            .setTitle(`🎄 ${user.username}'s Christmas Tree...`)
            .setDescription(
              `⬜⬛⬛⬛⬜⬛⬛⬛⬛⬛⬜⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬜⬛⬛⬛⬛⬛
            ⬛⬜⬛⬛⬜⬛⬛⬛⬛⬜⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬜⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬜⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬜⬛⬛⬛⬛⬛⬜
            ⬜⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬜⬜⬜⬛⬛⬛⬛⬛⬜⬛⬛
            ⬜⬛⬜⬜⬜⬜⬛⬛⬜⬜⬜⬜⬛`,
            )
            .setFooter({ text: "Didn't even start building it >:(" });
          break;

        case 1:
          embed
            .setColor(0x339999)
            .setTitle(`🎄 ${user.username}'s Christmas Tree`)
            .setDescription(
              `⬛⬛⬜⬛⬛⬛⬛⬛⬜⬛⬛⬛⬜
            ⬜⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬜⬛⬛⬛⬜⬛⬛⬛
            ⬛⬜⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬜⬛⬛⬛⬛⬜⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬛⬜⬛⬛⬛⬛
            ⬛⬛⬜⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬜⬛⬛⬛⬛⬜⬛
            ⬛⬜⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬛⬜⬛🟫⬜⬜⬛⬛⬛⬜
            ⬜⬜⬛⬛🟫🟫🟫🟫🟫⬛⬜⬜⬜`,
            )
            .setFooter({ text: "Didn't complete the tree in time" });
          break;

        case 2:
          embed
            .setColor(0x339999)
            .setTitle(`🎄 ${user.username}'s Christmas Tree`)
            .setDescription(
              `⬜⬛⬛⬜⬛⬛⬛⬛⬛⬜⬛⬛⬛
            ⬛⬛⬛⬛⬛⬜⬛⬛⬛⬛⬛⬜⬛
            ⬛⬛⬜⬛⬛⬛⬛⬛⬛⬜⬛⬛⬛
            ⬛⬛⬛⬛⬛⬛⬛⬜⬛⬛⬛⬛⬜
            ⬛⬛⬛⬛⬜⬛⬛⬛⬛⬛⬛⬛⬛
            ⬛⬜⬛⬛⬛⬛⬛⬛⬛⬜⬛⬛⬛
            ⬛⬛⬛⬜⬛⬛🟫⬜⬜⬛⬛⬛⬛
            ⬛⬛⬛🟫🟫🟫🟫🟫🟫🟫⬛⬜⬛
            ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
            ⬛⬛⬜⬛⬛⬛🟫⬛⬜⬛⬛⬛⬛
            ⬛⬜⬜⬛🟫🟫🟫🟫🟫⬜⬛⬜⬜`,
            )
            .setFooter({ text: "Didn't complete the tree in time" });
          break;

        case 3:
          embed
            .setColor(0x339999)
            .setTitle(`🎄 ${user.username}'s Christmas Tree`)
            .setDescription(
              `⬜⬛⬛⬛⬛⬜⬛⬛⬜⬛⬛⬛⬛
            ⬛⬛⬛⬜⬛⬛⬛⬛⬛⬛⬛⬜⬛
            ⬜⬛⬛⬛⬛⬜🟫⬛⬛⬜⬛⬛⬛
            ⬛⬛⬛⬛⬛🟫🟫🟫⬛⬛⬛⬛⬛
            ⬛⬜⬛⬛⬛⬛🟫⬛⬜⬛⬛⬛⬛
            ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬜⬛
            ⬛⬛⬛⬜⬜⬛🟫⬛⬛⬛⬜⬛⬛
            ⬛⬛⬛🟫🟫🟫🟫🟫🟫🟫⬛⬛⬜
            ⬛⬜⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬛
            ⬛⬛⬛⬜⬜⬛🟫⬛⬜⬜⬜⬛⬛
            ⬜⬜⬜⬜🟫🟫🟫🟫🟫⬜⬜⬜⬛`,
            )
            .setFooter({ text: "A tree without leaves :o" });
          break;

        case 4:
          embed
            .setColor(0x339999)
            .setTitle(`🎄 ${user.username}'s Christmas Tree`)
            .setDescription(
              `⬛⬜⬛⬛⬛⬛⬛⬛⬛⬜⬛⬛⬛
            ⬛⬛⬛⬛⬛⬜🟩⬛⬛⬛⬛⬛⬜
            ⬜⬛⬛⬛⬜🟩🟫🟩⬛⬜⬛⬛⬛
            ⬛⬜⬛⬛🟩🟫🟫🟫🟩⬛⬛⬜⬛
            ⬛⬛⬛🟩🟩🟩🟫🟩🟩🟩⬜⬛⬛
            ⬛⬛⬛🟩🟫🟫🟫🟫🟫🟩⬛⬛⬜
            ⬛⬜🟩🟩🟩🟩🟫🟩🟩🟩🟩⬛⬛
            ⬛⬛🟩🟫🟫🟫🟫🟫🟫🟫🟩⬜⬛
            ⬛🟩🟩🟩🟩🟩🟫🟩🟩🟩🟩🟩⬛
            ⬛⬛⬛⬛⬛⬛🟫⬛⬛⬛⬛⬛⬜
            ⬜⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬜⬜`,
            )
            .setFooter({ text: "Almost done :D" });
          break;

        case 5:
          const matrixForDecoratedTree = [
            ["⬜", "⬛", "⬛", "⬜", "⬛", "⬛", "⬛", "⬛", "⬛", "⬜", "⬛", "⬜", "⬛"],
            ["⬛", "⬛", "⬛", "⬛", "⬜", "⬛", "🟩", "⬛", "⬜", "⬛", "⬛", "⬛", "⬛"],
            ["⬛", "⬛", "⬜", "⬛", "⬛", "🟩", "🟩", "🟩", "⬛", "⬛", "⬜", "⬛", "⬜"],
            ["⬛", "⬛", "⬛", "⬛", "🟩", "🟩", "🟩", "🟩", "🟩", "⬛", "⬛", "⬛", "⬛"],
            ["⬛", "⬛", "⬛", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "⬛", "⬜", "⬛"],
            ["⬜", "⬛", "⬛", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "⬛", "⬛", "⬜"],
            ["⬛", "⬜", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "⬛", "⬛"],
            ["⬛", "⬛", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "⬛", "⬛"],
            ["⬛", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "⬛"],
            ["⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "🟫", "⬛", "⬛", "⬛", "⬛", "⬛", "⬜"],
            ["⬜", "⬜", "⬛", "⬛", "🟫", "🟫", "🟫", "🟫", "🟫", "⬛", "⬛", "⬜", "⬛"],
          ];

          if (row.deco_id1) {
            matrixForDecoratedTree[0][6] = "🌟";
          }

          if (row.deco_id2) {
            matrixForDecoratedTree[3][3] = "🕯️";
            matrixForDecoratedTree[3][9] = "🕯️";
            matrixForDecoratedTree[5][2] = "🕯️";
            matrixForDecoratedTree[5][10] = "🕯️";
            matrixForDecoratedTree[7][1] = "🕯️";
            matrixForDecoratedTree[7][11] = "🕯️";
          }

          if (row.deco_id3) {
            matrixForDecoratedTree[3][7] = "🔴";
            matrixForDecoratedTree[4][5] = "🟣";
            matrixForDecoratedTree[4][8] = "🔵";
            matrixForDecoratedTree[6][3] = "🔴";
            matrixForDecoratedTree[7][2] = "🟡";
            matrixForDecoratedTree[7][9] = "🟣";
            matrixForDecoratedTree[8][4] = "🔵";
            matrixForDecoratedTree[8][7] = "🟡";
          }

          if (row.deco_id4) {
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

          embed.setColor(0x339999).setTitle(`🎄 ${user.username}'s Christmas Tree`).setDescription(embedDescription);
          break;

        // IMPOSSIBLE
        default:
          break;
      }
    } else {
      const btnUpgrade = new ButtonBuilder().setCustomId("btn-tree-btnUpgrade").setLabel("Upgrade Tree").setStyle("Primary");
      const actionRow = new ActionRowBuilder().addComponents(btnUpgrade);

      switch (row.tree_level) {
        case 0:
          embed
            .setColor(0x339999)
            .setTitle(`🎄 ${user.username}'s Christmas Tree`)
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
            ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`,
            )
            .setFooter({ text: "Empty tree, start collecting materials with d!forest" });
          break;

        case 1:
          embed
            .setColor(0x339999)
            .setTitle(`🎄 ${user.username}'s Christmas Tree`)
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
            ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`,
            )
            .setFooter({ text: "Christmas Tree level 1/5" });
          break;

        case 2:
          embed
            .setColor(0x339999)
            .setTitle(`🎄 ${user.username}'s Christmas Tree`)
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
            ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`,
            )
            .setFooter({ text: "Christmas Tree level 2/5" });
          break;

        case 3:
          embed
            .setColor(0x339999)
            .setTitle(`🎄 ${user.username}'s Christmas Tree`)
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
            ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`,
            )
            .setFooter({ text: "Christmas Tree level 3/5" });
          break;

        case 4:
          embed
            .setColor(0x339999)
            .setTitle(`🎄 ${user.username}'s Christmas Tree`)
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
            ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`,
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

          if (row.deco_id1) {
            matrixForDecoratedTree[0][6] = "🌟";
          }

          if (row.deco_id2) {
            matrixForDecoratedTree[3][3] = "🕯️";
            matrixForDecoratedTree[3][9] = "🕯️";
            matrixForDecoratedTree[5][2] = "🕯️";
            matrixForDecoratedTree[5][10] = "🕯️";
            matrixForDecoratedTree[7][1] = "🕯️";
            matrixForDecoratedTree[7][11] = "🕯️";
          }

          if (row.deco_id3) {
            matrixForDecoratedTree[3][7] = "🔴";
            matrixForDecoratedTree[4][5] = "🟣";
            matrixForDecoratedTree[4][8] = "🔵";
            matrixForDecoratedTree[6][3] = "🔴";
            matrixForDecoratedTree[7][2] = "🟡";
            matrixForDecoratedTree[7][9] = "🟣";
            matrixForDecoratedTree[8][4] = "🔵";
            matrixForDecoratedTree[8][7] = "🟡";
          }

          if (row.deco_id4) {
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

          embed.setColor(0x339999).setTitle(`🎄 ${user.username}'s Christmas Tree`).setDescription(embedDescription);

          btnUpgrade.setLabel("Maxed Tree").setStyle("Secondary").setDisabled(true);
          break;
      }

      const sentMessage = await message.reply({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
      if (!sentMessage) return;

      const collector = sentMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 15_000,
      });

      collector.on("collect", async (btnInteraction) => {
        if (btnInteraction.user.id !== message.author.id) {
          btnInteraction.reply({ content: "This upgrade isn't for you bruh", flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
          return;
        }

        if (btnInteraction.customId === "btn-tree-btnUpgrade") {
          btnUpgrade.setStyle(ButtonStyle.Secondary).setDisabled(true); // should only use 1 time
          embed.setFooter(null); // empty this

          switch (row.tree_level) {
            case 0:
              if (row.twigs < 50 || row.leaves < 50) {
                embed.setColor(0xff0000).setTitle("❌ Missing Materials").setDescription("You need at least **50 twigs** and **50 leaves** to upgrade your tree");

                btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
                return;
              }

              await client.database.query("UPDATE events SET tree_level = 1, twigs = twigs - 50, leaves = leaves - 50 WHERE server_id = $1 AND user_id = $2", [
                message.guildId,
                message.author.id,
              ]);

              embed
                .setColor(0x339999)
                .setTitle(`🎄 ${user.username}'s Tree got upgraded!`)
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
                ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`,
                )
                .setFooter({ text: "New Christmas Tree level 1/5" });

              break;

            case 1:
              if (row.twigs < 100 || row.leaves < 100) {
                embed.setColor(0xff0000).setTitle("❌ Missing Materials").setDescription("You need at least **100 twigs** and **100 leaves** to upgrade your tree");

                btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
                return;
              }

              await client.database.query("UPDATE events SET tree_level = 2, twigs = twigs - 100, leaves = leaves - 100 WHERE server_id = $1 AND user_id = $2", [
                message.guildId,
                message.author.id,
              ]);

              embed
                .setColor(0x339999)
                .setTitle(`🎄 ${user.username}'s Tree got upgraded!`)
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
                ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`,
                )
                .setFooter({ text: "New Christmas Tree level 2/5" });

              break;

            case 2:
              if (row.twigs < 150 || row.leaves < 200) {
                embed.setColor(0xff0000).setTitle("❌ Missing Materials").setDescription("You need at least **150 twigs** and **200 leaves** to upgrade your tree");

                btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
                return;
              }

              await client.database.query("UPDATE events SET tree_level = 3, twigs = twigs - 150, leaves = leaves - 200 WHERE server_id = $1 AND user_id = $2", [
                message.guildId,
                message.author.id,
              ]);

              embed
                .setColor(0x339999)
                .setTitle(`🎄 ${user.username}'s Tree got upgraded!`)
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
                ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`,
                )
                .setFooter({ text: "New Christmas Tree level 3/5" });

              break;

            case 3:
              if (row.twigs < 200 || row.leaves < 300) {
                embed.setColor(0xff0000).setTitle("❌ Missing Materials").setDescription("You need at least **200 twigs** and **300 leaves** to upgrade your tree");

                btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
                return;
              }

              await client.database.query("UPDATE events SET tree_level = 4, twigs = twigs - 200, leaves = leaves - 300 WHERE server_id = $1 AND user_id = $2", [
                message.guildId,
                message.author.id,
              ]);

              embed
                .setColor(0x339999)
                .setTitle(`🎄 ${user.username}'s Tree got upgraded!`)
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
                ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`,
                )
                .setFooter({ text: "New Christmas Tree level 4/5" });

              break;

            case 4:
              if (row.twigs < 300 || row.leaves < 500) {
                embed.setColor(0xff0000).setTitle("❌ Missing Materials").setDescription("You need at least **300 twigs** and **500 leaves** to upgrade your tree");

                btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
                return;
              }

              await client.database.query("UPDATE events SET tree_level = 5, twigs = twigs - 300, leaves = leaves - 500 WHERE server_id = $1 AND user_id = $2", [
                message.guildId,
                message.author.id,
              ]);

              embed
                .setColor(0x339999)
                .setTitle(`🎄🎄🎄 ${user.username}'s Tree got MAXED!`)
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
                ⬛⬛⬛⬛🟫🟫🟫🟫🟫⬛⬛⬛⬛`,
                )
                .setFooter({ text: "The Christmas Tree has been completed!" });

              break;
          }

          btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
          return;
        }
      });

      collector.on("end", async () => {
        btnUpgrade.setStyle(ButtonStyle.Secondary).setDisabled(true);

        sentMessage.edit({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
      });
    }
  },
};
