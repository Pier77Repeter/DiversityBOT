const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "unadopt",
  description: "Unadopt a new pet",
  async execute(client, message, args) {
    const row = await client.database.query("SELECT has_pet, pet_id FROM users WHERE server_id = $2 AND user_id = $3", [message.guildId, message.author.id]);

    const embed = new EmbedBuilder();

    if (!row.rows[0].has_pet) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have any pet, even if you had one, don't do this");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    await client.database.query(
      "UPDATE users SET has_pet = 0, pet_id = NULL, pet_stats_health = 0, pet_stats_hunger = 0, pet_stats_thirst = 0, pet_cooldown = 0 WHERE server_id = $1 AND user_id = $2",
    );

    embed
      .setColor(0x990000)
      .setTitle("🐶 You unadopted " + client.users.cache.get(row.rows[0].pet_id).username)
      .setDescription("You have committed a very bad action >:(")
      .setThumbnail(client.users.cache.get(row.rows[0].pet_id).displayAvatarURL());

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
