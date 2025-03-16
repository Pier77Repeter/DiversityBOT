const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "rep",
  description: "Check user reputation on a server",
  async execute(client, message, args) {
    var member;
    if (message.mentions.members.first() == null) {
      member = message.author;
    } else {
      member = message.mentions.members.first().user;
    }

    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT reputation FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, member.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!row) {
      try {
        return await message.reply(member.username + " dosen't have any reputation on this server");
      } catch (error) {
        return;
      }
    }

    const rep = row.reputation;

    const repMessageEmbed = new EmbedBuilder()
      .setColor(0x33cc00)
      .setTitle(member.username + "'s reputation")
      .setDescription("Reputation on the server is: **" + rep + "**")
      .setThumbnail(member.displayAvatarURL());

    try {
      return await message.reply({ embeds: [repMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
