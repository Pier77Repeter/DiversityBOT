const { EmbedBuilder } = require("discord.js");
const mathRandomInt = require("../../utils/mathRandomInt");
const cooldownManager = require("../../utils/cooldownManager");

module.exports = {
  name: "petvisit",
  description: "Bring your pet to the vet",
  cooldown: 3600,
  async execute(client, message, args) {
    const row = await client.database.query("SELECT has_pet, pet_stats_health FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

    const embed = new EmbedBuilder();

    if (row.rowCount === 0 || !row.rows[0].has_pet) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have a pet, adopt it with **d!adopt <@user>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const cooldown = await cooldownManager(client, message, "pet_vet_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed
        .setColor(0x000000)
        .setTitle(null)
        .setDescription("⏰ Slowdown man, vet will be available again **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const petHealth = row.rows[0].pet_stats_health;
    let petHealthToAdd = mathRandomInt(15, 30);

    if (petHealth + petHealthToAdd > 100) {
      petHealthToAdd = 100 - petHealth;
    }

    await client.database.query("UPDATE users SET pet_stats_health = pet_stats_health + $1 WHERE server_id = $2 AND user_id = $3", [
      petHealthToAdd,
      message.guildId,
      message.author.id,
    ]);

    if (petHealth + petHealthToAdd >= 100) {
      embed.setColor(0xff0000).setTitle("Your pet is fine").setDescription("Your pet is healty, no need to bring it to the vet");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    embed
      .setColor(0x33cc00)
      .setTitle("You broght your pet to the vet")
      .setDescription("The vet visited your pet giving the right treatment")
      .setFooter({ text: "Your pet gained +" + petHealthToAdd + " health" });

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
