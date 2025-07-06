const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const manageUserMoney = require("../../utils/manageUserMoney");

module.exports = {
  name: "remove",
  description: "Remove money to user, only for admins",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const embed = new EmbedBuilder();

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have the permission to add money");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (!args[1]) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("How much money are you remove to " + user.username + "?");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (parseInt(args[1]) < 1 || parseInt(args[1]) > 1000000) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Number must be between **1 and 1000000**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT money FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("You can't give money to " + user.username + " because he never tried EVEN 1 of my commands! >:(");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if ((await manageUserMoney(client, message, "-", args[1])) == null) return;

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Operation completed")
      .setDescription("Successfully added **" + args[1] + "$** to " + user.username);

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
