const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Configure command categories for this server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The command category to configure.")
        .setRequired(true)
        .addChoices(
          { name: "Moderation", value: "moderation" },
          { name: "Music", value: "music" },
          { name: "Events", value: "events" },
          { name: "Community", value: "community" }
        )
    )
    .addBooleanOption((option) =>
      option.setName("enabled").setDescription("Enable or disable the category.").setRequired(true)
    ),
  async execute(client, interaction) {
    const category = interaction.options.getString("category");
    const enabled = interaction.options.getBoolean("enabled");

    let columnName;
    switch (category) {
      case "moderation":
        columnName = "modCmd";
        break;
      case "music":
        columnName = "musiCmd";
        break;
      case "events":
        columnName = "eventCmd";
        break;
      case "community":
        columnName = "communityCmd";
        break;
      default:
        return interaction.reply({ content: "Invalid category.", ephemeral: MessageFlags.Ephemeral }); // should not happen, but good to have.
    }

    await new Promise((resolve, reject) => {
      client.database.run(`UPDATE Server SET ${columnName} = ? WHERE serverId = ?`, [enabled, interaction.guildId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const setupMessageEmbed = new EmbedBuilder()
      .setColor(0x000099)
      .setDescription(
        `**${category.charAt(0).toUpperCase() + category.slice(1)}** commands are now **${enabled ? "ACTIVE" : "NOT ACTIVE"}**`
      );

    try {
      return await interaction.reply({ embeds: [setupMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
