const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");
const configChecker = require("../../utils/configChecker.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet.js");
const dbJsonDataSet = require("../../utils/dbJsonDataSet.js");

module.exports = {
  name: "rngdelete",
  aliases: ["rngdel", "rngremove", "rngrm"],
  description: "Remove an existing item from the server's drops",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isRngEnabled = await configChecker(client, message, "rng_cmd");
    if (isRngEnabled === null) return;

    if (!isRngEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("RNG commands are off! Type **d!setup rng** to enable them");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need the permission `Administrator` to use this command");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!args[0]) {
      embed.setColor(0xff0000).setTitle("❌ Missing ID").setDescription("Please provide the ID of the drop to remove, usage **d!rngdelete <id>**`");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const itemId = parseInt(args[0]);

    if (isNaN(itemId)) {
      embed.setColor(0xff0000).setTitle("❌ Invalid ID").setDescription("The ID must be a valid number, check the item ids with **d!drops**");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    // for deleting the item, first it gets deleted from the server list and then from everybody's inventory/found drops list
    const serverDrops = await dbJsonDataGet(client, message, "server_drops");

    if (!Array.isArray(serverDrops)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("No items have been configured in this server");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    // check if the item actually exists in the server pool
    const serverItemId = serverDrops.findIndex((drop) => drop.id === itemId);

    if (serverItemId === -1) {
      embed.setColor(0xff0000).setTitle("❌ Item not found").setDescription(`Item with id **${itemId}** wasn't found in the server drops list`);

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    serverDrops.splice(serverItemId, 1);

    if ((await dbJsonDataSet(client, message, "server_drops", serverDrops)) === null) return;

    // and now we remove the items from users, can't use dbJsonDataGet() as we need 'user_id'
    const userInventories = await client.database.query("SELECT user_id, found_drops FROM users WHERE server_id = $1", [message.guildId]);

    for (const row of userInventories.rows) {
      let userDrops = row.found_drops;

      if (!Array.isArray(userDrops)) continue;

      const hasItem = userDrops.some((drop) => drop.id === itemId);

      if (hasItem) {
        userDrops = userDrops.filter((drop) => drop.id !== itemId);

        if ((await dbJsonDataSet(client, message, "found_drops", userDrops, row.user_id)) == null) return;
      }
    }

    embed
      .setColor(0x00ff00)
      .setTitle("🗑️ Drop Removed")
      .setDescription(
        `Successfully deleted **${serverDrops[serverItemId - 1].name}** (ID: ${itemId}) from the server's drop list.\nThe drop has been wiped from the members's inventories too`,
      );

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
