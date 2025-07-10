const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, MessageFlags } = require("discord.js");
const configChecker = require("../utils/configChecker");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modlog")
    .setDescription("Setup the channel for logging mod actions")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((option) => option.setName("channel").setDescription("The channel where to log the mod actions").setRequired(false)),
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

    const channel = interaction.options.getChannel("channel") || "null";

    // turn this crap off
    if (channel == "null") {
      await new Promise((resolve, reject) => {
        client.database.run("UPDATE Server SET modLogChannel = ? WHERE serverId = ?", [channel, interaction.guild.id], (err) => {
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
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return;
      }
    }

    if (!interaction.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I don't have the permission to `Send messages` in that channel");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return;
      }
    }

    await new Promise((resolve, reject) => {
      client.database.run("UPDATE Server SET modLogChannel = ? WHERE serverId = ?", [channel.id, interaction.guild.id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("Moderation actions will be logged in <#" + channel.id + ">");

    try {
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } catch (error) {
      // continue
    }

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("📝 Mod actions logger")
      .setDescription(
        "Moderation actions (bans, kicks, mutes, etc.) will be logged in this channel, make sure i keep the permission to `Send messages` in this channel"
      )
      .setFooter({
        text: "Configured by " + interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    try {
      return await channel.send({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
