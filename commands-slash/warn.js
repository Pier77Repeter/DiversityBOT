const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const configChecker = require("../utils/configChecker");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn an user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName("member").setDescription("The user that needs to be warned").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason this user is being warned for").setMaxLength(1000).setRequired(false)),
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

    const memberToWarn = interaction.options.getMember("member");
    const warnReason = interaction.options.getString("reason") || "No reason provided";

    if (!memberToWarn) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Could not find that member in the server, they left...");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return;
      }
    }

    if (memberToWarn.id === interaction.user.id) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't warn yourself lol");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return;
      }
    }

    // this can work even if the user isn't in db, you need to actually type at least something to be warned so, this isn't an issue
    await new Promise((resolve, reject) => {
      client.database.run("UPDATE User SET warns = warns + 1 WHERE serverId = ? AND userId = ?", [interaction.guild.id, memberToWarn.user.id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("The user **" + memberToWarn.user.tag + "** has been warned");

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
          .setTitle("🛂 Warned member")
          .setDescription("**" + memberToWarn.user.tag + "** has been warned" + "\n" + "Reason: " + warnReason)
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
