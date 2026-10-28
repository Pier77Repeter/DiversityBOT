const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "unban",
  description: "Unban member from the server",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, message, "mod_cmd");
    if (isModEnabled === null) return;

    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **d!setup mod** to enable them");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("You need the permission `Ban Members` to use this command");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("I don't have the permission to `Ban Members`");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (args[0] === message.author.id) {
      embed.setColor(0xff0000).setTitle("❌ What?").setDescription("You can't unban yourself lol");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const userId = args[0];
    const unbanReason = args.slice(1).join(" ") || "No reason provided.";

    if (!userId) {
      embed.setColor(0xff0000).setTitle("❌ Missing User ID").setDescription("Please provide the **ID of the user** you want to unban");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    let bannedUser;

    try {
      bannedUser = await message.guild.bans.fetch(userId);
    } catch (error) {
      embed.setColor(0xff0000).setTitle("❌ Can't Unban").setDescription("This user hasn't been banned from the server");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!bannedUser) {
      embed.setColor(0xff0000).setTitle("❌ Can't Unban").setDescription(`The user id **${bannedUser.user.tag}** is NOT banned from the server`);

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    await message.guild.members.unban(userId, unbanReason);

    embed.setColor(0x33ff33).setTitle("✅ Unbanned").setDescription(`Successfully unbanned **${bannedUser.user.tag}** from the server`);

    await message.reply({ embeds: [embed] }).catch(msgErrorHandler);

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🔓 Unbanned Member")
      .setDescription(`**${bannedUser.user.tag}** has been unbanned from the server\nReason: ${unbanReason}`)
      .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    modActionLogger(client, message, embed);
  },
};
