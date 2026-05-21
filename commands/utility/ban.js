const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");

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

    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.BanMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I don't have the permission to `Ban members`");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (!message.mentions.members.first()) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need to mention the member you want to ban");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (message.mentions.members.first().user.id === message.author.id) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't ban yourself lol");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const userToBan = message.mentions.members.first();
    const banReason = args.slice(1).join(" ") || "No reason provided";

    if (!userToBan.bannable) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I can't ban this user, maybe they have a higher role than me?");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    // if we fail to ban the user, the error will be logged and catched in 'messageCreate.js'
    await userToBan.ban({
      deleteMessageSeconds: 60 * 60 * 24 * 7, // will delete all the messages sent in the last 7 days
      reason: banReason,
    });

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("The user **" + userToBan.user.tag + "** has been banned from the server");

    try {
      await message.reply({ embeds: [embed] });
    } catch {
      // continue
    }

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🔨 Banned member")
      .setDescription("**" + userToBan.user.tag + "** has been banned from the server" + "\n" + "Reason: " + banReason)
      .setFooter({ text: "Action by " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await modActionLogger(client, message, embed);
  },
};
