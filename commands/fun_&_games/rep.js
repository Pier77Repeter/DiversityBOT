const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "rep",
  description: "Check user reputation on a server",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await client.database.query("SELECT reputation FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

    const embed = new EmbedBuilder();

    if (row.rowCount === 0) {
      embed
        .setColor(0x33cc00)
        .setTitle(user.username + "'s reputation")
        .setDescription("Reputation on the server is: **0**")
        .setThumbnail(user.displayAvatarURL());

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const rep = row.rows[0].reputation;

    embed
      .setColor(0x33cc00)
      .setTitle(user.username + "'s reputation")
      .setDescription("Reputation on the server is: **" + rep + "**")
      .setThumbnail(user.displayAvatarURL());

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
