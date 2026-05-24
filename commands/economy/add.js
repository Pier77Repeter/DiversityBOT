const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "add",
  description: "Add money to user, only for admins",
  async execute(client, message, args) {
    // THIS IS PERFECT, USE THIS WHEN CHECKING IF MENTIONED USER OR MESSAGE AUTHOR
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const embed = new EmbedBuilder();

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have the permission to add money");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (!args[1]) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("How much money are you adding to " + user.username + "?");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (isNaN(args[1])) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You must provide a valid number");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (args[1] < 1 || args[1] > 1000000) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Number must be between **1 and 1000000**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const row = await client.database.query("SELECT money FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

    if (row.rowCount === 0) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("You can't give money to " + user.username + " because he never tried EVEN 1 of my commands! >:(");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    // prevent users from adding decimals
    const money = Math.trunc(args[1]);

    await client.database.query("UPDATE users SET money = money + $1 WHERE server_id = $2 AND user_id = $3", [money, message.guildId, user.id]);

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Operation completed")
      .setDescription("Successfully added **" + money + "$** to " + user.username);

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
