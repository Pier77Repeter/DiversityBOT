const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, MessageFlags } = require("discord.js");
const configChecker = require("../utils/configChecker");
const modActionLogger = require("../utils/modActionLogger");
const msgErrorHandler = require("../utils/msgErrorHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a user from the server")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) => option.setName("member").setDescription("The user that needs to be kicked").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason this user is being kicked for").setMaxLength(1000).setRequired(false)),
  async execute(client, interaction) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, interaction, "mod_cmd");
    if (isModEnabled === null) return;

    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **/setup** to enable them");

      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("I don't have the permission to `Kick Members` in this server");

      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    const memberToKick = interaction.options.getMember("member");
    const kickReason = interaction.options.getString("reason") || "No reason provided";

    if (!memberToKick) {
      embed.setColor(0xff0000).setTitle("❌ No Member").setDescription("Could not find that member in the server. They might have already left.");

      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    if (memberToKick.id === interaction.user.id) {
      embed.setColor(0xff0000).setTitle("❌ What?").setDescription("You can't kick yourself lol");

      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    if (!memberToKick.kickable) {
      embed.setColor(0xff0000).setTitle("❌ Can't Kick").setDescription("I can't kick this user, maybe they have a higher role than me");

      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    await memberToKick.kick({
      reason: kickReason,
    });

    embed.setColor(0x33ff33).setTitle("✅ Kicked").setDescription(`The user **${memberToKick.user.tag}** has been kicked from the server`);

    await interaction.reply({ embeds: [embed] }).catch(msgErrorHandler);

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("👢 Kicked Member")
      .setDescription(`The user ${memberToKick.user.tag}has been kicked from the server.\nReason: ${kickReason}`)
      .setFooter({ text: `Action by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return await modActionLogger(client, interaction, embed);
  },
};
