const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, MessageFlags } = require("discord.js");
const configChecker = require("../utils/configChecker");
const modActionLogger = require("../utils/modActionLogger");
const msgErrorHandler = require("../utils/msgErrorHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modlog")
    .setDescription("Setup the channel for logging mod actions")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((option) => option.setName("channel").setDescription("The channel where to log the mod actions").setRequired(false)),
  async execute(client, interaction) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, interaction, "mod_cmd");
    if (isModEnabled === null) return;

    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **/setup** to enable them");

      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    const channel = interaction.options.getChannel("channel") || null;

    // turn this crap off
    if (channel === null) {
      // do not worry about any error, it gets catched in interactionCreate.js
      await client.database.query("UPDATE servers SET mod_log_channel = $1 WHERE server_id = $2", [channel, interaction.guild.id]);

      embed
        .setColor(0x33ff33)
        .setTitle("✅ Logging Disabled")
        .setDescription(
          "You haven't mentioned any channel, this means that logging is now **NOT ACTIVE**" +
            "\n" +
            "You can mention a channel to active logging, make sure i have the permission to `Send Messages` in that channel",
        );

      return await interaction.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!interaction.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("I don't have the permission to `Send Messages` in that channel");

      return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(msgErrorHandler);
    }

    await client.database.query("UPDATE servers SET mod_log_channel = $1 WHERE server_id = $2", [channel.id, interaction.guild.id]);

    embed.setColor(0x33ff33).setTitle("✅ Done").setDescription(`Moderation actions will be logged in <#${channel.id}>`);

    await interaction.reply({ embeds: [embed] }).catch(msgErrorHandler);

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("📝 Mod Actions Logger")
      .setDescription("Moderation actions (bans, kicks, mutes, etc.) will be logged in this channel, make sure i keep the permission to `Send Messages` in this channel")
      .setFooter({
        text: `Configured by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    return await modActionLogger(client, interaction, embed);
  },
};
