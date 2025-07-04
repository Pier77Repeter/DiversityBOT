const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, MessageFlags } = require("discord.js");
const configChecker = require("../utils/configChecker");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a user from the server")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) => option.setName("member").setDescription("The user that needs to be kicked").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason this user is being kicked for").setMaxLength(1000).setRequired(false)),
  async execute(client, interaction) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, interaction, "modCmd");
    if (isModEnabled == null) return;

    if (isModEnabled == 0) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **/setup** to enable them");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return;
      }
    }

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I don't have the permission to `Kick members`");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return;
      }
    }

    const memberToKick = interaction.options.getMember("member");
    const kickReason = interaction.options.getString("reason") || "No reason provided";

    if (!memberToKick) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Could not find that member in the server. They might have already left.");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return;
      }
    }

    if (memberToKick.id === interaction.user.id) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't kick yourself lol");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return;
      }
    }

    if (!memberToKick.kickable) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I can't kick this user, maybe they have a higher role than me");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return;
      }
    }

    try {
      await memberToKick.kick({
        reason: kickReason,
      });
    } catch (error) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Something bad happened while trying to kick this user");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return;
      }
    }

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("The user **" + memberToKick.user.tag + "** has been kicked from the server");

    try {
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } catch (error) {
      // continue
    }

    // MOD LOGGING HERE
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT modLogChannel FROM Server WHERE serverId = ?", [interaction.guild.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (row && row.modLogChannel && row.modLogChannel !== "null") {
      const channel = interaction.guild.channels.cache.get(row.modLogChannel);
      if (channel) {
        embed
          .setColor(0x33ff33)
          .setTitle("👢 Kicked member")
          .setDescription("The user " + memberToKick.user.tag + "has been kicked from the server.\nReason: " + kickReason)
          .setFooter({ text: "Action by " + interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
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
