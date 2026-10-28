const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "unmute",
  description: "Unmute a member of the server",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, message, "mod_cmd");
    if (isModEnabled === null) return;

    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **d!setup mod** to enable them");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("You need the permission `Moderate Members` to use this command");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ModerateMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("I don't have the permission to `Moderate Members`");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!message.mentions.members.first()) {
      embed.setColor(0xff0000).setTitle("❌ Missing User").setDescription("You need to mention the member you want to unmute");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (message.mentions.members.first().user.id === message.author.id) {
      embed.setColor(0xff0000).setTitle("❌ What?").setDescription("You can't unmute yourself lol");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!message.mentions.members.first().moderatable) {
      embed.setColor(0xff0000).setTitle("❌ Can't Unmute").setDescription("I can't unmute this user, maybe they have a higher role than me?");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const userToMute = message.mentions.members.first();
    const muteReason = args.slice(1).join(" ") || "No reason provided";

    await userToMute.timeout(null, muteReason);

    embed.setColor(0x33ff33).setTitle("✅ Unmuted").setDescription(`The user **${userToMute.user.tag}** has been unmuted\nReason: ${muteReason}`);

    await message.reply({ embeds: [embed] }).catch(msgErrorHandler);

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🔈 Unmuted member")
      .setDescription(`**${userToMute.user.tag}** has been unmuted\nReason: ${muteReason}`)
      .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    modActionLogger(client, message, embed);
  },
};
