const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "lxpb",
  description: "Shows the server XP leaderboard",
  async execute(client, message, args) {
    const rows = await new Promise((resolve, reject) => {
      client.database.all(
        "SELECT userId, level FROM User WHERE serverId = ? ORDER BY level DESC LIMIT 10",
        message.guild.id,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    const lxpbMessageEmbed = new EmbedBuilder()
      .setColor(0x00cccc)
      .setTitle("Nobody has XP")
      .setDescription("Empty...")
      .setFooter({ text: "Make some of your members chat" });

    if (!rows) {
      try {
        return await message.reply({ embeds: [lxpbMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    var leaderBoardText = "";

    for (let i = 0; i < rows.length; i++) {
      const user = await message.client.users.fetch(rows[i].userId).catch(() => null);
      leaderBoardText += i + 1 + ") " + user.username + " - **" + rows[i].level + "**";
    }

    lxpbMessageEmbed
      .setTitle("📊 Top 10 highest levels in the server:")
      .setDescription(leaderBoardText)
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });

    try {
      return await message.reply({ embeds: [lxpbMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
