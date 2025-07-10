const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "rep",
  description: "Check user reputation on a server",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT reputation FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const embed = new EmbedBuilder();

    if (!row) {
      embed
        .setColor(0x33cc00)
        .setTitle(user.username + "'s reputation")
        .setDescription("Reputation on the server is: **0**")
        .setThumbnail(user.displayAvatarURL());

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const rep = row.reputation;

    embed
      .setColor(0x33cc00)
      .setTitle(user.username + "'s reputation")
      .setDescription("Reputation on the server is: **" + rep + "**")
      .setThumbnail(user.displayAvatarURL());

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
