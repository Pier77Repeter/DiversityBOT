const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");

module.exports = {
  name: "unban",
  description: "Unban member from the server",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, message, "mod_cmd");
    if (isModEnabled === null) return;

    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **d!setup mod** to enable them");
      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need the permission `Ban members` to use this command");
      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I don't have the permission to `Ban members`");
      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (args[0] === message.author.id) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't unban yourself lol");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const userId = args[0];
    const unbanReason = args.slice(1).join(" ") || "No reason provided.";

    if (!userId) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Please provide the **ID of the user** you want to unban");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    var bannedUser;

    try {
      bannedUser = await message.guild.bans.fetch(userId);
    } catch {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("This user hasn't been banned from the server");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (!bannedUser) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("The user id **" + bannedUser.user.tag + "** is NOT banned from the server");
      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    await message.guild.members.unban(userId, unbanReason);

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("Successfully unbanned **" + bannedUser.user.tag + "** from the server");
    try {
      await message.reply({ embeds: [embed] });
    } catch {
      // continue for logging
    }

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🔓 Unbanned member")
      .setDescription("**" + bannedUser.user.tag + "** has been unbanned from the server" + "\n" + "Reason: " + unbanReason)
      .setFooter({ text: "Action by " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await modActionLogger(client, message, embed);
  },
};
