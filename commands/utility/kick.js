const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");

module.exports = {
  name: "kick",
  description: "Kick a member from the server",
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

    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need the permission `Kick members` to use this command");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.KickMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I don't have the permission to `Kick members`");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (!message.mentions.members.first()) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need to mention the member you want to kick");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (message.mentions.members.first().user.id === message.author.id) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't kick yourself lol");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (!message.mentions.members.first().kickable) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I can't kick this user, maybe they have a higher role than me?");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const userToKick = message.mentions.members.first();
    const kickReason = args.slice(1).join(" ") || "No reason provided";

    await userToKick.kick({
      reason: kickReason,
    });

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("The user **" + userToKick.user.tag + "** has been kicked from the server");

    try {
      await message.reply({ embeds: [embed] });
    } catch {
      // continue
    }

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("👢 Kicked member")
      .setDescription("**" + userToKick.user.tag + "** has been kick from the server" + "\n" + "Reason: " + kickReason)
      .setFooter({ text: "Action by " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await modActionLogger(client, message, embed);
  },
};
