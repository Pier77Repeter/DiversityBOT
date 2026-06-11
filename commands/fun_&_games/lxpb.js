const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "lxpb",
  description: "Shows the server XP leaderboard",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isLevelingEnabled = await configChecker(client, message, "leveling_cmd");
    if (isLevelingEnabled === null) return;

    if (!isLevelingEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Leveling commands are off! Type **d!setup leveling** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const row = await client.database.query("SELECT user_id, level FROM users WHERE server_id = $1 ORDER BY level DESC LIMIT 10", [message.guildId]);

    embed.setColor(0x00cccc);

    if (row.rowCount === 0) {
      embed.setTitle("Nobody has XP").setDescription("Empty...").setFooter({ text: "Make some of your members chat" });

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const rows = row.rows;
    let leaderBoardText = "";
    let index = 0; // added this because in case user is null you would see in the leaderboard skipped numbers, example: 1), 2), 4), 7). depends how many invalid users the are

    for (let i = 0; i < rows.length; i++) {
      index++;
      const user = await message.client.users.fetch(rows[i].user_id).catch(() => null);

      if (user !== null) {
        leaderBoardText += i + 1 + ") " + user.username + " - **" + rows[i].level + "\n**";
      }

      if (user === null) {
        index--; // prevent number skipping
      }
    }

    embed.setTitle("📊 Top 10 highest levels in the server").setDescription(leaderBoardText).setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
