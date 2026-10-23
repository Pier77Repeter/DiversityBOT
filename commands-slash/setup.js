const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const msgErrorHandler = require("../utils/msgErrorHandler");

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
          { name: "🏆 Leveling commands", value: "leveling" },
          { name: "🎲 RNG commands", value: "rng" },
        ),
    )
    .addBooleanOption((option) => option.setName("enabled").setDescription("Enable or disable the category").setRequired(true)),
  async execute(client, interaction) {
    const category = interaction.options.getString("category");
    const enabled = interaction.options.getBoolean("enabled");

    let columnName, enabledCmds;

    switch (category) {
      case "moderation":
        columnName = "mod_cmd";
        enabledCmds = "🔨 Moderation commands";
        break;

      case "music":
        columnName = "music_cmd";
        enabledCmds = "🎵 Music commands";
        break;

      case "events":
        columnName = "event_cmd";
        enabledCmds = "🎉 Events commands";
        break;

      case "community":
        columnName = "community_cmd";
        enabledCmds = "🌍 Community commands";
        break;

      case "leveling":
        columnName = "leveling_cmd";
        enabledCmds = "🏆 Leveling commands";
        break;

      case "rng":
        columnName = "rng_cmd";
        enabledCmds = "🎲 RNG commands";
        break;

      default:
        interaction.reply({ content: "Invalid category.", ephemeral: MessageFlags.Ephemeral }).catch(msgErrorHandler); // should not happen, but good to have
        return;
    }

    await client.database.query(`UPDATE servers SET ${columnName} = $1 WHERE server_id = $2`, [enabled, interaction.guildId]);

    const embed = new EmbedBuilder()
      .setColor(0x33ff33)
      .setTitle("✅ Configuration Updated")
      .setDescription(`${enabledCmds} are now **${enabled ? "ACTIVE" : "NOT ACTIVE"}**`);

    interaction.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
