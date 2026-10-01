const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");
const configChecker = require("../../utils/configChecker.js");

module.exports = {
  name: "rngdc",
  aliases: ["rngdropchance", "rngcalc", "rngcalculator", "rngitem"],
  description: "Set the global chance to find a drop for sending a message",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isRngEnabled = await configChecker(client, message, "rng_cmd");
    if (isRngEnabled === null) return;

    if (!isRngEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("RNG commands are off! Type **d!setup rng** to enable them");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("You need the permission `Administrator` to use this command");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const dropChance = args[0];

    if (!dropChance) {
      embed.setColor(0xff0000).setTitle("❌ Missing ID").setDescription("Correct command usage as example is **d!rngdc 3**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (isNaN(dropChance)) {
      embed.setColor(0xff0000).setTitle("❌ Invalid Number").setDescription("You must provide a valid integer number");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (dropChance < 1 || dropChance > 100) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Out Of Range")
        .setDescription("Number must be between **1** and **100**\nIt is highly reccomended to set a number between **1** and **10** to reduce unwanted spam");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    await client.database.query("UPDATE servers SET rng_drop_chance = $1 WHERE server_id = $2", [dropChance, message.guildId]);

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Drop Chance Updated")
      .setDescription(`The Global Drop Chance has been set to **${dropChance}%**\n\n*It is highly reccomended to set it between **1%** and **10%** to reduce Bot's spam*`);

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
