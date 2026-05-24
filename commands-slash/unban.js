const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, MessageFlags } = require("discord.js");
const configChecker = require("../utils/configChecker");
const modActionLogger = require("../utils/modActionLogger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a user from the server")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) => option.setName("userid").setDescription("The user id of the banned member").setMaxLength(20).setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason of the unban").setMaxLength(1000).setRequired(false)),
  async execute(client, interaction) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, interaction, "mod_cmd");
    if (isModEnabled === null) return;

    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **/setup** to enable them");
      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    // Bot's permissions check
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I don't have the permission to `Ban members`");
      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    const memberId = interaction.options.getString("userid");
    const unbanReason = interaction.options.getString("reason") || "No reason provided";

    if (memberId === interaction.user.id) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't unban yourself lol");
      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    let bannedUser;

    try {
      bannedUser = await interaction.guild.bans.fetch(memberId);
    } catch {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("This user hasn't been banned from the server");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    // as always, the error is catch in interactionCreate.js
    await interaction.guild.members.unban(bannedUser.user.id, unbanReason);

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("Successfully unbanned **" + bannedUser.user.tag + "** from the server");

    try {
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } catch {
      // continue, do not stop
    }

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🔓 Unbanned member")
      .setDescription("**" + bannedUser.user.tag + "** has been unbanned from the server" + "\n" + "Reason: " + unbanReason)
      .setFooter({ text: "Action by " + interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await modActionLogger(client, interaction, embed);
  },
};
