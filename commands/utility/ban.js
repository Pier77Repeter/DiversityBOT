const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "ban",
  description: "Ban a member from the server",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    // CHECK THE CONFIG CHECKER FIRST!
    const isModEnabled = await configChecker(client, message, "mod_cmd");

    // oh no, something went wrong, message is already sent, so we gotta HALT the command execution!
    if (isModEnabled === null) return;

    // 'configChecker()' returns either true or false read that first
    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **d!setup mod** to enable them");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("You need the permission `Ban Members` to use this command");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.BanMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("I don't have the permission to `Ban Members`");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.mentions.members.first()) {
      embed.setColor(0xff0000).setTitle("❌ Missing User").setDescription("You need to mention the member you want to ban");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (message.mentions.members.first().user.id === message.author.id) {
      embed.setColor(0xff0000).setTitle("❌ What?").setDescription("You can't ban yourself lol");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const userToBan = message.mentions.members.first();
    const banReason = args.slice(1).join(" ") || "No reason provided";

    if (!userToBan.bannable) {
      embed.setColor(0xff0000).setTitle("❌ Can't Ban").setDescription("I can't ban this user, maybe they have a higher role than me?");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    // if we fail to ban the user, the error will be logged and catched in 'messageCreate.js'
    await userToBan.ban({
      deleteMessageSeconds: 60 * 60 * 24 * 7, // will delete all the messages sent in the last 7 days
      reason: banReason,
    });

    embed.setColor(0x33ff33).setTitle("✅ Banned").setDescription(`The user **${userToBan.user.tag}** has been banned from the server`);

    await message.reply({ embeds: [embed] }).catch(msgErrorHandler);

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🔨 Banned Member")
      .setDescription(`**${userToBan.user.tag}** has been banned from the server\nReason: ${banReason}`)
      .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return await modActionLogger(client, message, embed);
  },
};
