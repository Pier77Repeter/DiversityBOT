const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, MessageFlags } = require("discord.js");
const configChecker = require("../utils/configChecker");
const modActionLogger = require("../utils/modActionLogger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user from the server")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) => option.setName("member").setDescription("The user that needs to be banned").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason this user is being banned for").setMaxLength(1000).setRequired(false)),
  async execute(client, interaction) {
    const embed = new EmbedBuilder();

    // CHECK THE CONFIG CHECKER FIRST!
    const isModEnabled = await configChecker(client, interaction, "mod_cmd");

    // oh no, something went wrong, message is already sent, so we gotta HALT the command execution!
    if (isModEnabled === null) return;

    // configChecker() returns either true or false
    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **/setup** to enable them");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I don't have the permission to `Ban members`");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    const memberToBan = interaction.options.getMember("member");
    const banReason = interaction.options.getString("reason") || "No reason provided";

    if (!memberToBan) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Could not find that member in the server, he's gone already");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    if (memberToBan.id === interaction.user.id) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't ban yourself lol");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    if (!memberToBan.bannable) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I can't ban this user, maybe they have a higher role than me");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    // if we fail to ban the user, the error will be logged and catched in 'messageCreate.js'
    await memberToBan.ban({
      reason: banReason,
    });

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("The user **" + memberToBan.user.tag + "** has been banned from the server");

    try {
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } catch {
      // continue
    }

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🔨 Banned member")
      .setDescription("The user " + memberToBan.user.tag + "has been banned from the server.\nReason: " + banReason)
      .setFooter({ text: "Action by " + interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    // very spicy utility function
    await modActionLogger(client, interaction, embed);
  },
};
