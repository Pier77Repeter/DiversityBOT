const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "ban",
  description: "Ban a member from the server",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, message, "modCmd");
    if (isModEnabled == null) return;

    if (isModEnabled == 0) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Moderation commands are off! Type **d!setup mod** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need the permission `Ban members` to use this command");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.BanMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I don't have the permission to `Ban members`");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    try {
      if (message.mentions.members.first() == null) {
        embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need to mention the member you want to ban");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }
      }
    } catch (error) {
      return;
    }

    const userToBan = message.mentions.users.first();
    const banReason = args[1] || "No reason provided";

    try {
      await userToBan.ban({
        deleteMessageSeconds: 60 * 60 * 24, // will delete all the messages sent in the last 24h
        reason: banReason,
      });
    } catch (error) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Something bad happened while trying to ban this user");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("The user **" + userToBan.tag + "** has been banned from the server");

    try {
      await message.reply({ embeds: [embed] });
    } catch (error) {
      // continue
    }

    // MOD LOGGING HERE
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT modLogChannel FROM Server WHERE serverId = ?", [message.guild.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (row && row.modLogChannel && row.modLogChannel !== "null") {
      const channel = message.guild.channels.cache.get(row.modLogChannel);
      if (channel) {
        embed
          .setColor(0x33ff33)
          .setTitle("🔨 Banned member")
          .setDescription("**" + userToBan.tag + "** has been banned from the server" + "\n" + "Reason: " + banReason)
          .setFooter({ text: "Action by " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setTimestamp();

        try {
          return await channel.send({ embeds: [embed] });
        } catch (error) {
          return;
        }
      }
    }
  },
};
