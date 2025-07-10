const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "lxpb",
  description: "Shows the server XP leaderboard",
  async execute(client, message, args) {
    const rows = await new Promise((resolve, reject) => {
      // using '.all()' because we get more than 1 row
      client.database.all("SELECT userId, level FROM User WHERE serverId = ? ORDER BY level DESC LIMIT 10", message.guild.id, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const embed = new EmbedBuilder().setColor(0x00cccc);

    if (!rows) {
      embed.setTitle("Nobody has XP").setDescription("Empty...").setFooter({ text: "Make some of your members chat" });

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    var leaderBoardText = "";
    var index = 0; // added this because in case user is null you would see in the leaderboard skipped numbers, example: 1), 2), 4), 7). depends how many invalid users the are

    for (let i = 0; i < rows.length; i++) {
      index++;
      const user = await message.client.users.fetch(rows[i].userId).catch(() => null);

      if (user != null) {
        leaderBoardText += i + 1 + ") " + user.username + " - **" + rows[i].level + "\n**";
      }

      if (user == null) {
        index--; // prevent number skipping
      }
    }

    embed
      .setTitle("📊 Top 10 highest levels in the server:")
      .setDescription(leaderBoardText)
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
