const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Configure command categories for this server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The command category to configure")
        .setRequired(true)
        .addChoices(
          { name: "🔨 Moderation commands", value: "moderation" },
          { name: "🎵 Music commands", value: "music" },
          { name: "🎉 Events commands", value: "events" },
          { name: "🌍 Community commands", value: "community" },
          { name: "🏆 Leveling commands", value: "leveling" }
        )
    )
    .addBooleanOption((option) => option.setName("enabled").setDescription("Enable or disable the category").setRequired(true)),
  async execute(client, interaction) {
    const category = interaction.options.getString("category");
    const enabled = interaction.options.getBoolean("enabled");

    let columnName, enabledCmds;
    switch (category) {
      case "moderation":
        columnName = "modCmd";
        enabledCmds = "🔨 Moderation commands";
        break;
      case "music":
        columnName = "musiCmd";
        enabledCmds = "🎵 Music commands";
        break;
      case "events":
        columnName = "eventCmd";
        enabledCmds = "🎉 Events commands";
        break;
      case "community":
        columnName = "communityCmd";
        enabledCmds = "🌍 Community commands";
        break;
      case "leveling":
        columnName = "levelingCmd";
        enabledCmds = "🏆 Leveling commands";
        break;
      default:
        return interaction.reply({ content: "Invalid category.", ephemeral: MessageFlags.Ephemeral }); // should not happen, but good to have
    }

    await new Promise((resolve, reject) => {
      client.database.run(`UPDATE Server SET ${columnName} = ? WHERE serverId = ?`, [enabled, interaction.guildId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const embed = new EmbedBuilder()
      .setColor(0x33ff33)
      .setTitle("✅ Configuration updated")
      .setDescription(`${enabledCmds} are now **${enabled ? "ACTIVE" : "NOT ACTIVE"}**`);

    try {
      return await interaction.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
