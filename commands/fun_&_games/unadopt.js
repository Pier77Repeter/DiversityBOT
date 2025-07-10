const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "unadopt",
  description: "Unadopt a new pet",
  async execute(client, message, args) {
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT hasPet, petId FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const embed = new EmbedBuilder();

    if (!row.hasPet) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have any pet, even if you had one, don't do this");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    await new Promise((resolve, reject) => {
      client.database.run(
        "UPDATE User SET hasPet = 0, petId = 'null', petStatsHealth = 0, petStatsFun = 0, petStatsHunger = 0, petStatsThirst = 0, petCooldown = 0 WHERE serverId = ? AND userId = ?",
        [message.guild.id, message.author.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    embed
      .setColor(0x990000)
      .setTitle("You unadopted " + client.users.cache.get(row.petId).username)
      .setDescription("you commited bad action >:(")
      .setThumbnail(client.users.cache.get(row.petId).displayAvatarURL());

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
