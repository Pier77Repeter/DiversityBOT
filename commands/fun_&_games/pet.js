const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "pet",
  description: "Check user pet",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT hasPet, petId, petStatsHealth, petStatsFun, petStatsHunger, petStatsThirst FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, user.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    const embed = new EmbedBuilder();

    if (!row || !row.hasPet) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("No pet here, type **d!adopt <@user>** to adopt one");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    embed
      .setColor(0x00cccc)
      .setTitle("🐱 Your fluffy " + client.users.cache.get(row.petId).username)
      .setDescription(
        [
          "These are all the pet stats, don't make them reach 0%",
          "Otherwise you will lose your pet",
          "Your pet name and image gets updated everytime the user you...",
          '..."adopted" (sounds kinda sussy) change them',
        ].join("\n")
      )
      .setThumbnail(client.users.cache.get(row.petId).displayAvatarURL())
      .setFields(
        {
          name: "💟 Health",
          value: "**" + row.petStatsHealth + "%**",
          inline: true,
        },
        {
          name: "🎾 Fun",
          value: "**" + row.petStatsFun + "%**",
          inline: true,
        },
        {
          name: "\n",
          value: "\n",
          inline: false,
        },
        {
          name: "🍗 Hunger",
          value: "**" + row.petStatsHunger + "%**",
          inline: true,
        },
        {
          name: "💧 Thirst",
          value: "**" + row.petStatsThirst + "%**",
          inline: true,
        }
      )
      .setFooter({ text: "Remember to check them often, stats go down" });

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
