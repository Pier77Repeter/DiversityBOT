const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("config").setDescription("Displays Bot configuration in the server"),

  async execute(client, interaction) {
    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT modCmd, musiCmd, eventCmd, communityCmd FROM Server WHERE serverId = ?",
        interaction.guild.id,
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    const configMessageEmbed = new EmbedBuilder();

    if (!row) {
      configMessageEmbed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Failed to get server config, please **report this error with your server ID**")
        .addFields({ name: "Submit here", value: "https://discord.gg/KxadTdz" });

      try {
        return await interaction.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    configMessageEmbed
      .setColor(0x000099)
      .setTitle("⚙️ " + interaction.guild.name + "'s Bot settings")
      .setDescription(
        "Since you are seeing this from /config instead of d!config, you can use /setup for easier managment instead of typing d!setup <thingCmd> <on/off> (thank me later for this tip ;))"
      )
      .spliceFields(0, 1);

    if (row.modCmd) {
      configMessageEmbed.addFields({
        name: "🔨 Moderation commands",
        value: "✅ Moderation commands are: **ACTIVE**",
      });
    } else {
      configMessageEmbed.addFields({
        name: "🔨 Moderation commands",
        value: "❌ Moderation commands are: **NOT ACTIVE**",
      });
    }

    if (row.musiCmd) {
      configMessageEmbed.addFields({
        name: "🎵 Music commands",
        value: "✅ Music commands are: **ACTIVE**",
      });
    } else {
      configMessageEmbed.addFields({
        name: "🎵 Music commands",
        value: "❌ Music commands are: **NOT ACTIVE**",
      });
    }

    if (row.eventCmd) {
      configMessageEmbed.addFields({
        name: "🎉 Events commands",
        value: "✅ Events commands are: **ACTIVE**",
      });
    } else {
      configMessageEmbed.addFields({
        name: "🎉 Events commands",
        value: "❌ Events commands are: **NOT ACTIVE**",
      });
    }

    if (row.communityCmd) {
      configMessageEmbed.addFields({
        name: "🌍 Community commands",
        value: "✅ Community commands are: **ACTIVE**",
      });
    } else {
      configMessageEmbed.addFields({
        name: "🌍 Community commands",
        value: "❌ Community commands are: **NOT ACTIVE**",
      });
    }

    try {
      return await interaction.reply({ embeds: [configMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
