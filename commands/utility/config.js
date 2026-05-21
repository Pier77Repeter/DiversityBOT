const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "config",
  description: "Shows bot configurations",
  async execute(client, message, args) {
    const row = await client.database.query("SELECT mod_cmd, music_cmd, event_cmd, community_cmd, leveling_cmd, mod_log_channel FROM servers WHERE server_id = $1", [
      message.guildId,
    ]);

    const embed = new EmbedBuilder();

    if (row.rowCount === 0) {
      embed
        .setColor(0xff0000)
        .setTitle("⚠️ Critical error")
        .setDescription("Failed to get server configs, please **report this error with the server ID**")
        .addFields({ name: "Server ID", value: `\`${message.guildId}\``, inline: true }, { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" });

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const configs = row.rows[0];

    embed
      .setColor(0x000099)
      .setTitle("⚙️ " + message.guild.name + "'s Bot settings")
      .setDescription("You are seeing this with **d!config** command, i suggest you to use **/config** instead, it's much easier to configure")
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

    if (configs.mod_log_channel !== "null") {
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
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
