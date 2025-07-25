const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "config",
  description: "Shows bot configurations",
  async execute(client, message, args) {
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT modCmd, musiCmd, eventCmd, communityCmd, modLogChannel FROM Server WHERE serverId = ?", message.guild.id, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const embed = new EmbedBuilder();

    if (!row) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Failed to get server config, please **report this error with your server ID**")
        .addFields({ name: "Submit here", value: "https://discord.gg/KxadTdz" });

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    embed
      .setColor(0x000099)
      .setTitle("⚙️ " + message.guild.name + "'s Bot settings")
      .setDescription("You are seeing this with **d!config** command, i suggest you to use **/config** instead, it's much easier to configure")
      .spliceFields(0, 1);

    if (row.modCmd) {
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

    if (row.musiCmd) {
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

    if (row.eventCmd) {
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

    if (row.communityCmd) {
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

    if (row.modLogChannel !== "null") {
      embed.addFields({
        name: "📝 Mod logging",
        value: "✅ Moderator actions are being logged in <#" + row.modLogChannel + ">",
      });
    } else {
      embed.addFields({
        name: "📝 Mod logging",
        value: "❌ Moderator actions are **NOT** being logged",
      });
    }

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
