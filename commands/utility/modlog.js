const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "modlog",
  description: "Setup the logging channel for mod actions",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("You need the permission `Manage channels` to use this command");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const channel = message.mentions.channels.first() || message.channel;

    await new Promise((resolve, reject) => {
      client.database.run("UPDATE Server SET modLogChannel = ? WHERE serverId = ?", [channel.id, message.guild.id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("Moderation actions will be logged in <#" + channel.id + ">");

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
