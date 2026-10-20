const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "kick",
  description: "Kick a member from the server",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, message, "mod_cmd");
    if (isModEnabled === null) return;

    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **d!setup mod** to enable them");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("You need the permission `Kick Members` to use this command");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.KickMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("I don't have the permission to `Kick Members`");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.mentions.members.first()) {
      embed.setColor(0xff0000).setTitle("❌ Missing User").setDescription("You need to mention the member you want to kick");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (message.mentions.members.first().user.id === message.author.id) {
      embed.setColor(0xff0000).setTitle("❌ What?").setDescription("You can't kick yourself lol");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.mentions.members.first().kickable) {
      embed.setColor(0xff0000).setTitle("❌ Can't Kick").setDescription("I can't kick this user, maybe they have a higher role than me?");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const userToKick = message.mentions.members.first();
    const kickReason = args.slice(1).join(" ") || "No reason provided";

    await userToKick.kick({
      reason: kickReason,
    });

    embed.setColor(0x33ff33).setTitle("✅ Kicked").setDescription(`The user **${userToKick.user.tag}** has been kicked from the server`);

    await message.reply({ embeds: [embed] }).catch(msgErrorHandler);

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("👢 Kicked Member")
      .setDescription(`**${userToKick.user.tag}** has been kick from the server\nReason: ${kickReason}`)
      .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return await modActionLogger(client, message, embed);
  },
};
