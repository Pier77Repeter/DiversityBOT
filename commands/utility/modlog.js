const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "modlog",
  description: "Setup the logging channel for mod actions",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, message, "mod_cmd");
    if (isModEnabled === null) return;

    if (isModEnabled === 0) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **d!setup mod** to enable them");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("You need the permission `Manage Channels` to use this command");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const channel = message.mentions.channels.first() || null;

    // to turn it off
    if (channel === null) {
      await client.database.query("UPDATE servers SET mod_log_channel = $1 WHERE server_id = $2", [channel, message.guildId]);

      embed
        .setColor(0x33ff33)
        .setTitle("✅ Logging Disabled")
        .setDescription(
          "You haven't mentioned any channel, this means that logging is now **NOT ACTIVE**" +
            "\n" +
            "You can mention a channel to active logging, make sure i have the permission to `Send messages` in that channel",
        );

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!message.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("I don't have the permission to `Send Messages` in that channel");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    await client.database.query("UPDATE servers SET mod_log_channel = $1 WHERE server_id = $2", [channel.id, message.guildId]);

    embed.setColor(0x33ff33).setTitle("✅ Done").setDescription(`Moderation actions will be logged in <#${channel.id}>`);

    await message.reply({ embeds: [embed] }).catch(msgErrorHandler);

    // let them know
    embed
      .setColor(0x33ff33)
      .setTitle("📝 Mod Actions Logger")
      .setDescription("Moderation actions (bans, kicks, mutes, etc.) will be logged in this channel, make sure i keep the permission to `Send messages` in this channel")
      .setFooter({
        text: `Configured by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
