const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");
const configChecker = require("../../utils/configChecker.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet.js");

module.exports = {
  name: "rngselect",
  aliases: ["rngsel", "rngs"],
  description: "Select an item for the rng meter",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isRngEnabled = await configChecker(client, message, "rng_cmd");
    if (isRngEnabled === null) return;

    if (!isRngEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("RNG commands are off! Type **d!setup rng** to enable them");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const row = await client.database.query("SELECT rng_meter_selection, rng_meter_progress FROM users WHERE server_id = $1 AND user_id = $2", [
      message.guildId,
      message.author.id,
    ]);

    let userMeter = row.rows[0] || { rng_meter_selection: null, rng_meter_progress: 0 };

    if (!args[0] || args[0].toLowerCase() === "none") {
      userMeter.rng_meter_selection = null;

      await client.database.query("UPDATE users SET rng_meter_selection = NULL WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

      embed.setColor(0x00ff00).setTitle("✅ RNG Meter Unselected").setDescription("You are no longer tracking any specific drop");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const dropNameOrId = args[0];

    let serverDrops = (await dbJsonDataGet(client, message, "server_drops")) || [];

    const selectedItem = serverDrops.find((drop) => drop.id === dropNameOrId || drop.name.toLowerCase() === dropNameOrId.toLowerCase());

    if (!selectedItem) {
      embed.setColor(0xff0000).setTitle("❌ Item Not Found").setDescription(`Item with id or name **${dropNameOrId}** wasn't found in the server's drops list`);
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    // check for any switch
    if (userMeter.rng_meter_selection !== selectedItem.id) {
      await client.database.query("UPDATE users SET rng_meter_selection = $1 WHERE server_id = $2 AND user_id = $3", [selectedItem.id, message.guildId, message.author.id]);
    }

    embed.setColor(0x00ff00).setTitle("🎯 RNG Meter Selected").setDescription(`Meter set to **${selectedItem.name}**, may the RNG be with you :pray:`);
    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
