const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "modlog",
  description: "Setup the logging channel for mod actions",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, message, "modCmd");
    if (isModEnabled == null) return;

    if (isModEnabled == 0) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **d!setup mod** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need the permission `Manage channels` to use this command");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const channel = message.mentions.channels.first() || "null";

    // to turn it off
    if (channel == "null") {
      await new Promise((resolve, reject) => {
        client.database.run("UPDATE Server SET modLogChannel = ? WHERE serverId = ?", [channel, message.guild.id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      embed
        .setColor(0x33ff33)
        .setTitle("✅ Logging disabled")
        .setDescription(
          "You haven't mentioned any channel, this means that logging is now **NOT ACTIVE**" +
            "\n" +
            "You can mention a channel to active logging, make sure i have the permission to `Send messages` in that channel"
        );

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (!message.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I don't have the permission to `Send messages` in that channel");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    await new Promise((resolve, reject) => {
      client.database.run("UPDATE Server SET modLogChannel = ? WHERE serverId = ?", [channel.id, message.guild.id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("Moderation actions will be logged in <#" + channel.id + ">");

    try {
      await message.reply({ embeds: [embed] });
    } catch (error) {
      // continue
    }

    // let them know
    embed
      .setColor(0x33ff33)
      .setTitle("📝 Mod actions logger")
      .setDescription(
        "Moderation actions (bans, kicks, mutes, etc.) will be logged in this channel, make sure i keep the permission to `Send messages` in this channel"
      )
      .setFooter({
        text: "Configured by " + message.author.tag,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    try {
      return await channel.send({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
