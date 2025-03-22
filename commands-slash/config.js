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

    if (!row) {
      try {
        return await interaction.reply("Failed to get server's configs, try later");
      } catch (error) {
        return;
      }
    }

    const configMessageEmbed = new EmbedBuilder()
      .setColor(0x000099)
      .setTitle("⚙️ " + interaction.guild.name + "'s Bot settings")
      .setDescription(
        "Since you are seeing this from /config instead of d!config, you can use /setup for easier managment instead of typing d!setup <thingCmd> <on/off> (thank me later for this tip ;))"
      );

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
