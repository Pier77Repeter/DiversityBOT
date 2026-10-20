const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "mute",
  description: "Mute a member of the server",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, message, "mod_cmd");
    if (isModEnabled === null) return;

    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **d!setup mod** to enable them");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("You need the permission `Moderate Members` to use this command");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ModerateMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("I don't have the permission to `Moderate Members`");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.mentions.members.first()) {
      embed.setColor(0xff0000).setTitle("❌ Missing User").setDescription("You need to mention the member you want to mute");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (message.mentions.members.first().user.id === message.author.id) {
      embed.setColor(0xff0000).setTitle("❌ What?").setDescription("You can't mute yourself lol");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.mentions.members.first().moderatable) {
      embed.setColor(0xff0000).setTitle("❌ Can't Mute").setDescription("I can't mute this user, maybe they have a higher role than me?");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (isNaN(args[1]) || !(parseInt(args[1]) > 0)) {
      embed.setColor(0xff0000).setTitle("❌ Invalid Number").setDescription("You need to provide a valid mute time in minutes");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const userToMute = message.mentions.members.first();
    const muteTime = args[1];
    const muteReason = args.slice(2).join(" ") || "No reason provided";

    await userToMute.timeout(muteTime * 60 * 1000, muteReason);

    embed.setColor(0x33ff33).setTitle("✅ Muted").setDescription(`The user **${userToMute.user.tag}** has been muted for \`${muteTime} minutes\`\nReason: ${muteReason}`);

    await message.reply({ embeds: [embed] }).catch(msgErrorHandler);

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🔇 Muted Member")
      .setDescription(`**${userToMute.user.tag}** has been muted for ${muteTime} minutes\nReason: ${muteReason}`)
      .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return await modActionLogger(client, message, embed);
  },
};
