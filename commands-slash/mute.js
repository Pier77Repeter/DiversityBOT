const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, MessageFlags } = require("discord.js");
const configChecker = require("../utils/configChecker");
const modActionLogger = require("../utils/modActionLogger");
const msgErrorHandler = require("../utils/msgErrorHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Timeout a member")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName("member").setDescription("The user that needs to be kicked").setRequired(true))
    .addNumberOption((option) => option.setName("time").setDescription("Time in minutes").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason this user is being muted for").setMaxLength(1000).setRequired(false)),
  async execute(client, interaction) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, interaction, "mod_cmd");
    if (isModEnabled === null) return;

    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **/setup** to enable them");
      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("I don't have the permission to `Moderate Members` in this server");
      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    const memberToMute = interaction.options.getMember("member");
    const muteTime = interaction.options.getNumber("time");
    const muteReason = interaction.options.getString("reason") || "No reason provided";

    if (!memberToMute) {
      embed.setColor(0xff0000).setTitle("❌ No Member").setDescription("Could not find that member in the server, did they just left?");
      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    if (memberToMute.id === interaction.user.id) {
      embed.setColor(0xff0000).setTitle("❌ What?").setDescription("You can't mute yourself lol");
      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    if (!memberToMute.moderatable) {
      embed.setColor(0xff0000).setTitle("❌ Can't Mute").setDescription("I can't mute this user, maybe they have a higher role than me");
      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    await memberToMute.timeout(muteTime * 60 * 1000, muteReason);

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Muted")
      .setDescription("The user **" + memberToMute.user.tag + "** has been muted for `" + muteTime + " minutes`" + "\n" + "Reason: " + muteReason);

    await interaction.reply({ embeds: [embed] }).catch(msgErrorHandler);

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🔇 Muted Member")
      .setDescription("**" + memberToMute.user.tag + "** has been muted for " + muteTime + " minutes" + "\n" + "Reason: " + muteReason)
      .setFooter({ text: "Action by " + interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return await modActionLogger(client, interaction, embed);
  },
};
