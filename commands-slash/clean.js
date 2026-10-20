const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, MessageFlags } = require("discord.js");
const configChecker = require("../utils/configChecker");
const modActionLogger = require("../utils/modActionLogger");
const msgErrorHandler = require("../utils/msgErrorHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clean")
    .setDescription("Removed an amount of messages from the channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addNumberOption((option) => option.setName("messages").setDescription("Number of messages to clean from the channel").setMinValue(1).setMaxValue(100).setRequired(true)),
  async execute(client, interaction) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, interaction, "mod_cmd");
    if (isModEnabled === null) return;

    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **/setup** to enable them");

      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("I don't have the permission to `Manage Messages` in this server");

      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    const amount = interaction.options.getNumber("messages");
    const fetchedMessages = await interaction.channel.messages.fetch({ limit: amount });
    const messagesToProcess = fetchedMessages.toJSON().slice(0, amount);

    let deletedCount = 0;

    // in this chunk many things could go wrong while deleting the messages, dont wanna vomit the useless error, i trust this thing to delete the needed messages
    try {
      const deleted = await interaction.channel.bulkDelete(messagesToProcess, true);
      deletedCount = deleted.size;
    } catch {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Failed to Delete Messages")
        .setDescription("An error occurred while trying to clean messages, messages older than 14 days cannot be deleted, try a smaller amount");

      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Cleaned")
      .setDescription(`Successfully cleaned **${deletedCount}** messages from the channel`);

    await interaction.reply({ embeds: [embed] }).catch(msgErrorHandler);

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🧹 Cleaned Messages")
      .setDescription(`Cleaned **${deletedCount}** messages from channel <#${interaction.channelId}>`)
      .setFooter({ text: `Action by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    return await modActionLogger(client, interaction, embed);
  },
};
