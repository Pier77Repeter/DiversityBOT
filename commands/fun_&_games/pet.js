const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "pet",
  description: "Check user pet",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await client.database.query(
      "SELECT has_pet, pet_id, pet_stats_health, pet_stats_fun, pet_stats_hunger, pet_stats_thirst FROM users WHERE server_id = $1 AND user_id $2",
      [message.guildId, user.id],
    );

    const embed = new EmbedBuilder();

    if (row.rowCount === 0 || !row.rows[0].has_pet) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("No pet here, type **d!adopt <@user>** to adopt one");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const rowData = row.rows[0];

    embed
      .setColor(0x00cccc)
      .setTitle("🐱 Your fluffy " + client.users.cache.get(rowData.pet_id).username)
      .setDescription(
        [
          "These are all the pet stats, don't make them reach 0%",
          "Otherwise you will lose your pet",
          "Your pet name and image gets updated everytime the user you...",
          '..."adopted" (sounds kinda sussy) change them',
        ].join("\n"),
      )
      .setThumbnail(client.users.cache.get(rowData.pet_id).displayAvatarURL())
      .setFields(
        {
          name: "💟 Health",
          value: "**" + rowData.pet_stats_health + "%**",
          inline: true,
        },
        {
          name: "🎾 Fun",
          value: "**" + rowData.pet_stats_fun + "%**",
          inline: true,
        },
        {
          name: "\n",
          value: "\n",
          inline: false,
        },
        {
          name: "🍗 Hunger",
          value: "**" + rowData.pet_stats_hunger + "%**",
          inline: true,
        },
        {
          name: "💧 Thirst",
          value: "**" + rowData.pet_stats_thirst + "%**",
          inline: true,
        },
      )
      .setFooter({ text: "Remember to check them often, stats go down" });

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
