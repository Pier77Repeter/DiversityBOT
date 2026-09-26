const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const configChecker = require("../utils/configChecker");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rngdc")
    .setDescription("Set the global drop chance in the server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addNumberOption((option) => option.setName("chance").setDescription("Number between 1 and 100").setRequired(true)),
  async execute(client, interaction) {
    const embed = new EmbedBuilder();

    const isRngEnabled = await configChecker(client, interaction, "rng_cmd");
    if (isRngEnabled === null) return;

    if (!isRngEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("RNG commands are off! Type **d!setup rng** to enable them");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    const dropChance = interaction.options.getNumber("chance");

    if (dropChance < 1 || dropChance > 100) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Number must be between **1** and **100**\nIt is highly reccomended to set a number between **1** and **10** to reduce unwanted spam");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    await client.database.query("UPDATE servers SET rng_drop_chance = $1 WHERE server_id = $2", [dropChance, interaction.guildId]);

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription(`The Global Drop Chance has been set to **${dropChance}%**\n\n*It is highly reccomended to set the chance between **1%** and **10%** to reduce Bot's spam*`);

    try {
      return await interaction.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
