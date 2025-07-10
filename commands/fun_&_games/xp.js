const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "xp",
  description: "Check how much XP the user has",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT xp, nextXp FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const embed = new EmbedBuilder();

    if (!row) {
      embed
        .setColor(0x00cccc)
        .setTitle(user.username + " current XP")
        .setDescription("Bro has literally **0 XP** 🤦‍♂️")
        .setThumbnail(user.displayAvatarURL());

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const xp = row.xp;
    const nextXp = row.nextXp;

    embed.setDescription(["🪩 XP: **" + xp + "**", "", "⏭️ XP for the next level: **" + (nextXp - xp) + "**"].join("\n"));

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
