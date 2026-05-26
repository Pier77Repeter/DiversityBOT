const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "adopt",
  description: "Adopt a new pet, the mentioned user...",
  async execute(client, message, args) {
    try {
      if (!message.mentions.members.first()) return await message.reply(message.author.username + ", mention the user you want to adopt");
    } catch {
      return;
    }

    const adoptedMember = message.mentions.members.first().user;

    const row = await client.database.query("SELECT has_pet FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

    const embed = new EmbedBuilder().setColor(0xff0000).setTitle("❌ Error").setDescription("You already have a pet, type **d!pet** to check it!");

    if (row.rows[0].has_pet) {
      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const petStatsCooldown = Date.now() + 10800000; // start imediatly at 3h
    await client.database.query(
      "UPDATE users SET has_pet = 1, pet_id = $1, pet_stats_health = 100, pet_stats_fun = 100, pet_stats_hunger = 100, pet_stats_thirst = 100, pet_cooldown = $2 WHERE server_id = $3 AND user_id = $4",
      [adoptedMember.id, petStatsCooldown, message.guildId, message.author.id],
    );

    embed
      .setColor(0x33cc00)
      .setTitle("🐶 You adopted " + adoptedMember.username)
      .setDescription("You've just got a new pet, type **d!pet** to check his stats!")
      .setThumbnail(adoptedMember.displayAvatarURL())
      .setFooter({ text: "It's important to check them often" });

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
