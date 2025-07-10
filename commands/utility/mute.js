const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "mute",
  description: "Mute a member of the server",
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

    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need the permission `Moderate members` to use this command");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ModerateMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I don't have the permission to `Moderate members`");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (message.mentions.members.first() == null) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need to mention the member you want to mute");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (message.mentions.members.first().user.id === message.author.id) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't mute yourself lol");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (!message.mentions.members.first().moderatable) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I can't mute this user, maybe they have a higher role than me?");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (isNaN(args[1]) || !(parseInt(args[1]) > 0)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need to provide a valid mute time in minutes");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const userToMute = message.mentions.members.first();
    const muteTime = args[1];
    const muteReason = args.slice(2).join(" ") || "No reason provided";

    try {
      await userToMute.timeout(muteTime * 60 * 1000, muteReason);
    } catch (error) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Something bad happened while trying to mute this user");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("The user **" + userToMute.user.tag + "** has been muted for `" + muteTime + " minutes`" + "\n" + "Reason: " + muteReason);

    try {
      await message.reply({ embeds: [embed] });
    } catch (error) {
      // continue
    }

    // MOD LOGGING HERE
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT modLogChannel FROM Server WHERE serverId = ?", [message.guild.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (row && row.modLogChannel && row.modLogChannel !== "null") {
      const channel = message.guild.channels.cache.get(row.modLogChannel);
      if (channel) {
        embed
          .setColor(0x33ff33)
          .setTitle("🔇 Muted member")
          .setDescription("**" + userToMute.user.tag + "** has been muted for " + muteTime + " minutes" + "\n" + "Reason: " + muteReason)
          .setFooter({ text: "Action by " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setTimestamp();

        try {
          return await channel.send({ embeds: [embed] });
        } catch (error) {
          return;
        }
      }
    }
  },
};
