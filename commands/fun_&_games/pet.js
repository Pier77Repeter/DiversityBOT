const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "pet",
  description: "Check user pet",
  async execute(client, message, args) {
    var member;
    try {
      member = message.mentions.members.first().user;
    } catch (error) {
      member = message.author;
    }

    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT hasPet, petId, petStatsHealth, petStatsFun, petStatsHunger, petStatsThirst FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, member.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    const petMessageEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("No pet here, type **d!adopt <@user>** to adopt one");

    if (!row) {
      try {
        return await message.reply({ embeds: [petMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    if (row.hasPet == 0) {
      try {
        return await message.reply({ embeds: [petMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    petMessageEmbed
      .setColor(0x00cccc)
      .setTitle("🐱 Your fluffy: " + client.users.cache.get(row.petId).username)
      .setDescription(
        [
          "These are all your pet stats, don't make them reach 0%",
          "\n",
          "Otherwise you will lose your pet",
          "\n",
          "Your pet name and image gets updated everytime the user you...",
          "\n",
          '..."adopted" (sounds kinda sussy) change them',
        ].join("")
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
      return await message.reply({ embeds: [petMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
