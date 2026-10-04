const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "rngxpremove",
  aliases: ["rngxpr"],
  description: "Remove experience to the rng meter of an user",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const embed = new EmbedBuilder();

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have the permission to add money");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!args[1]) {
      embed.setColor(0xff0000).setTitle("❌ Missing Exp").setDescription(`Correct usage is **d!rngxpremove <@user> <amount>**`);
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (isNaN(args[1]) || args[1] < 1 || args[1] > 100000000) {
      embed.setColor(0xff0000).setTitle("❌ Invalid Number").setDescription("Insert a valid number between **1 and 100000000**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const row = await client.database.query("SELECT rng_meter_progress FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

    if (row.rowCount === 0) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription(`You can't remove rng exp from ${user.username} because he never tried EVEN 1 of my commands! >:(`);
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const rngExp = Math.trunc(args[1]);

    await client.database.query(
      `
      UPDATE users
      SET rng_meter_progress = rng_meter_progress - (CASE WHEN rng_meter_progress - $1 <= 0 THEN rng_meter_progress ELSE $1 END)
      WHERE server_id = $2 AND user_id = $3
      `,
      [rngExp, message.guildId, user.id],
    );

    embed.setColor(0x33ff33).setTitle("✅ EXP Removed").setDescription(`Successfully removed **${rngExp} RNG Exp** from ${user.username}`);
    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
