const { EmbedBuilder } = require("discord.js");
const dbJsonDataUpdater = require("../../utils/dbJsonDataUpdater");
const delay = require("./../../utils/delay");

module.exports = {
  name: "use",
  description: "Use command, can display list of items or use",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();
    const itemToUse = args[0].toLowerCase();

    if (!itemToUse) {
      embed
        .setColor(0xff6600)
        .setTitle("Here is the list of usable items:")
        .setDescription(["d!use banana", "d!use beans", "d!use poo <@user>"].join("\n"));

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT items FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, message.author.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!row) {
      try {
        return await message.reply("No items were found in your inventory");
      } catch (error) {
        return;
      }
    }

    const items = JSON.parse(row.items);

    switch (itemToUse) {
      case "banana":
        if (!items.itemId7) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have a banana, buy it!");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId7 = false;

        await dbJsonDataUpdater(client, message, "items", items);

        embed.setColor(0xffcc00).setTitle("Delicious").setDescription("You ate the banana! 🍌🍌🍌");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "beans":
        if (!items.itemId8) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have beans, buy them!");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        items.itemId8 = false;

        await dbJsonDataUpdater(client, message, "items", items);

        embed.setColor(0xffcc00).setTitle("Delicious").setDescription("You ate the beans! 🥫🥫🥫");

        var sentMessage;
        try {
          sentMessage = await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

        delay(3000);

        embed.setColor(0x000000).setTitle("And...").setDescription(null);
        try {
          await sentMessage.edit({ embeds: [embed] });
        } catch (error) {
          return;
        }

        delay(2000);

        embed.setColor(0x33ff33).setTitle("💨💨💨 You farted!");
        try {
          return await sentMessage.edit({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "poo":
        if (!items.itemId9) {
          embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have poo, b-..buy it?");

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        if (!message.mentions.members.first()) {
          try {
            return await message.reply("Mention your victim before using the poo");
          } catch (error) {
            return;
          }
        }

        items.itemId9 = false;

        await dbJsonDataUpdater(client, message, "items", items);

        embed
          .setColor(0x0ffcc00)
          .setTitle("You trow the poo 💩")
          .setDescription(message.mentions.members.first().user.username + " is ded! HA! HA! HA!");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      default:
        embed
          .setColor(0xff0000)
          .setTitle("❌ Error")
          .setDescription("That items dosen't exist, type **d!use** to see the list");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }
    }
  },
};
