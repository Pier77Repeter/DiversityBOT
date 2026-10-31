const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "buydeco",
  description: "Buy decorations for the christmas tree from the decoshop",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isEventEnabled = await configChecker(client, message, "event_cmd");
    if (isEventEnabled === null) return;

    if (!isEventEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Event commands are off! Type **d!setup event** to enable them");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const res = await client.database.query("SELECT tree_level, golde_coins FROM events WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);
    // hmmmmm, looks cleaner
    const row = res.rows[0];

    // as you can see, instead of 'row.rowCount === 0'
    if (!row) {
      embed
        .setColor(0xff0000)
        .setTitle("⚠️ Critical Error")
        .setDescription("Failed to get your database data, please **report this error with the server id and your user id**")
        .addFields(
          { name: "Server ID", value: `\`${message.guildId}\``, inline: true },
          { name: "User ID", value: `\`${message.author.id}\``, inline: true },
          { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" },
        );

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (row.tree_level !== 5) {
      embed.setColor(0xff0000).setTitle("❌ Not Yet").setDescription("You need to upgrade your Christmas tree to **level 5** to unlock the decorations");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const deco = args.join(" ").toLowerCase();

    switch (deco) {
      case "christmas star":
        if (row.goldenCoins < 300) {
          embed.setColor(0xff0000).setTitle("❌ Not Enough Money").setDescription("You need at least **300 🪙** golden coins to buy the Christmas Star!");

          message.reply({ embeds: [embed] }).catch(msgErrorHandler);
          return;
        }

        await client.database.query("UPDATE events SET golden_coins = golden_coins - 300, deco_id1 = 1 WHERE server_id = $1 AND user_id = $2", [
          message.guildId,
          message.author.id,
        ]);

        embed.setColor(0x00ff00).setTitle("✅ Decoration Bought").setDescription("You have bought the **Christmas Star** for your Christmas tree!");

        message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        return;

      case "candles":
        if (row.goldenCoins < 100) {
          embed.setColor(0xff0000).setTitle("❌ Not Enough Money").setDescription("You need at least **100 🪙** golden coins to buy the Candles!");

          message.reply({ embeds: [embed] }).catch(msgErrorHandler);
          return;
        }

        await client.database.query("UPDATE events SET golden_coins = golden_coins - 100, deco_id2 = 1 WHERE server_id = $1 AND user_id = $2", [
          message.guildId,
          message.author.id,
        ]);

        embed.setColor(0x00ff00).setTitle("✅ Decoration Bought").setDescription("You have bought the **Candles** for your Christmas tree!");

        message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        return;

      case "christmas balls":
        if (row.goldenCoins < 50) {
          embed.setColor(0xff0000).setTitle("❌ Not Enough Money").setDescription("You need at least **50 🪙** golden coins to buy the Christmas Balls!");

          message.reply({ embeds: [embed] }).catch(msgErrorHandler);
          return;
        }

        await client.database.query("UPDATE events SET golden_coins = golden_coins - 50, deco_id3 = 1 WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

        embed.setColor(0x00ff00).setTitle("✅ Decoration Bought").setDescription("You have bought the **Christmas Balls** for your Christmas tree!");

        message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        return;

      case "tree decorations":
        if (row.goldenCoins < 50) {
          embed.setColor(0xff0000).setTitle("❌ Not Enough Money").setDescription("You need at least **50 🪙** golden coins to buy the Tree Decorations!");

          message.reply({ embeds: [embed] }).catch(msgErrorHandler);
          return;
        }

        await client.database.query("UPDATE events SET golden_coins = golden_coins - 50, deco_id4 = 1 WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

        embed.setColor(0x00ff00).setTitle("✅ Decoration Bought").setDescription("You have bought the **Tree Decorations** for your Christmas tree!");

        message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        return;

      default:
        embed
          .setColor(0xff0000)
          .setTitle("❌ Invalid Decoration")
          .setDescription("Unknown decoration, choose between: **Christmas Star**, **Candles**, **Christmas Balls**, **Tree Decorations**");

        message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        return;
    }
  },
};
