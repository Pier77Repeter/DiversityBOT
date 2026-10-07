const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "lxpb",
  description: "Shows the server XP leaderboard",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isLevelingEnabled = await configChecker(client, message, "leveling_cmd");
    if (isLevelingEnabled === null) return;

    if (!isLevelingEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Leveling commands are off! Type **d!setup leveling** to enable them");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const row = await client.database.query("SELECT user_id, level FROM users WHERE server_id = $1 ORDER BY level DESC LIMIT 10", [message.guildId]);

    embed.setColor(0x00cccc);

    if (row.rowCount === 0) {
      embed.setTitle("📉 Nobody has XP").setDescription("Make your members chat AND -> use my commands at least once");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const rows = row.rows;
    let lbUsersList = "";
    let lbLvlList = "";
    let index = 0; // added this because in case user is null you would see in the leaderboard skipped numbers, example: 1), 2), 4), 7). depends how many invalid users the are

    for (let i = 0; i < rows.length; i++) {
      index++;
      const user = await message.client.users.fetch(rows[i].user_id).catch(() => null);
      const lvl = rows[i].level;

      if (user !== null) {
        // this is just for estetics
        switch (index) {
          case 1:
            lbUsersList += `🥇 ${user.username}\n`;
            lbLvlList += `🥇 **${lvl}**\n`;
            break;

          case 2:
            lbUsersList += `🥈 ${user.username}\n`;
            lbLvlList += `🥈 **${lvl}**\n`;
            break;

          case 3:
            lbUsersList += `🥉 ${user.username}\n`;
            lbLvlList += `🥉 **${lvl}**\n`;
            break;

          default:
            lbUsersList += `${index}) ${user.username}\n`;
            lbLvlList += `**${lvl}**\n`;
            break;
        }
      }

      if (user === null) {
        index--; // prevent number skipping
      }
    }

    embed
      .setTitle("📊 Top 10 Active Members")
      .addFields({ name: "Users", value: lbUsersList, inline: true }, { name: "Levels", value: lbLvlList, inline: true })
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
