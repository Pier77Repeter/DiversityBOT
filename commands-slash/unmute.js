const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, MessageFlags } = require("discord.js");
const configChecker = require("../utils/configChecker");
const modActionLogger = require("../utils/modActionLogger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Cancel the timeout of a member")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName("member").setDescription("The user that needs to be kicked").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason this user is being unmuted for").setMaxLength(1000).setRequired(false)),
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

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I don't have the permission to `Moderate members`");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    const memberToUnmute = interaction.options.getMember("member");
    const unmuteReason = interaction.options.getString("reason") || "No reason provided";

    if (!memberToUnmute) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Could not find that member in the server, did they just left?");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    if (memberToUnmute.id === interaction.user.id) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't unmute yourself lol");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    if (!memberToUnmute.moderatable) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I can't unmute this user, maybe they have a higher role than me");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    await memberToUnmute.timeout(null, unmuteReason);

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("The user **" + memberToUnmute.user.tag + "** has been unmuted" + "\n" + "Reason: " + unmuteReason);

    try {
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } catch {
      // continue
    }

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🔈 Unmuted member")
      .setDescription("**" + memberToUnmute.user.tag + "** has been unmuted" + "\n" + "Reason: " + unmuteReason)
      .setFooter({ text: "Action by " + interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await modActionLogger(client, interaction, embed);
  },
};
