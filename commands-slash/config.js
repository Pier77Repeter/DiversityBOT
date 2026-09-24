const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("config").setDescription("Displays Bot configuration in the server"),

  async execute(client, interaction) {
    const row = await client.database.query(
      "SELECT mod_cmd, music_cmd, event_cmd, community_cmd, leveling_cmd, rng_cmd, rng_drop_chance, mod_log_channel FROM servers WHERE server_id = $1",
      [interaction.guildId],
    );

    const embed = new EmbedBuilder();

    if (row.rowCount === 0) {
      embed
        .setColor(0xff0000)
        .setTitle("⚠️ Critical error")
        .setDescription("Failed to get server configs, please **report this error with the server ID**")
        .addFields({ name: "Server ID", value: `\`${interaction.guildId}\``, inline: true }, { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" });

      try {
        return await interaction.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const configs = row.rows[0];

    embed
      .setColor(0x000099)
      .setTitle("⚙️ " + interaction.guild.name + "'s Bot settings")
      .setDescription("You can use **/setup** to turn on and off these configs, only admins can use that command")
      .spliceFields(0, 1);

    if (configs.mod_cmd) {
      embed.addFields({
        name: "🔨 Moderation commands",
        value: "✅ Moderation commands are: **ACTIVE**",
      });
    } else {
      embed.addFields({
        name: "🔨 Moderation commands",
        value: "❌ Moderation commands are: **NOT ACTIVE**",
      });
    }

    if (configs.music_cmd) {
      embed.addFields({
        name: "🎵 Music commands",
        value: "✅ Music commands are: **ACTIVE**",
      });
    } else {
      embed.addFields({
        name: "🎵 Music commands",
        value: "❌ Music commands are: **NOT ACTIVE**",
      });
    }

    if (configs.event_cmd) {
      embed.addFields({
        name: "🎉 Events commands",
        value: "✅ Events commands are: **ACTIVE**",
      });
    } else {
      embed.addFields({
        name: "🎉 Events commands",
        value: "❌ Events commands are: **NOT ACTIVE**",
      });
    }

    if (configs.community_cmd) {
      embed.addFields({
        name: "🌍 Community commands",
        value: "✅ Community commands are: **ACTIVE**",
      });
    } else {
      embed.addFields({
        name: "🌍 Community commands",
        value: "❌ Community commands are: **NOT ACTIVE**",
      });
    }

    if (configs.leveling_cmd) {
      embed.addFields({
        name: "🏆 Leveling commands",
        value: "✅ Leveling commands are: **ACTIVE**",
      });
    } else {
      embed.addFields({
        name: "🏆 Leveling commands",
        value: "❌ Leveling commands are: **NOT ACTIVE**",
      });
    }

    // both embed fields are influenced by the same config
    if (configs.rng_cmd) {
      embed.addFields(
        {
          name: "🎲 RNG commands",
          value: "✅ RNG commands are: **ACTIVE**",
        },
        {
          name: "🧮 RNG drop chance",
          value: "✅ RNG Chance to find any drop is: **" + configs.rng_drop_chance + "%**",
        },
      );
    } else {
      embed.addFields(
        {
          name: "🎲 RNG commands",
          value: "❌ RNG commands are: **NOT ACTIVE**",
        },
        {
          name: "🧮 RNG drop chance",
          value: "❌ RNG Chance to find any drop is: **" + configs.rng_drop_chance + "%**",
        },
      );
    }

    if (configs.mod_log_channel !== null) {
      embed.addFields({
        name: "📝 Mod logging",
        value: "✅ Moderator actions are being logged in <#" + configs.mod_log_channel + ">",
      });
    } else {
      embed.addFields({
        name: "📝 Mod logging",
        value: "❌ Moderator actions are **NOT** being logged",
      });
    }

    try {
      return await interaction.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
