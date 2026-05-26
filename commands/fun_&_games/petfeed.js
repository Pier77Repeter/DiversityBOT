const { EmbedBuilder } = require("discord.js");
const mathRandomInt = require("../../utils/mathRandomInt");
const cooldownManager = require("../../utils/cooldownManager");

module.exports = {
  name: "petfeed",
  description: "Feed your pet",
  cooldown: 3600,
  async execute(client, message, args) {
    const row = await client.database.query("SELECT has_pet, pet_stats_hunger FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

    const embed = new EmbedBuilder();

    if (row.rowCount === 0 || !row.rows[0].has_pet) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have a pet, adopt it with **d!adopt <@user>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const cooldown = await cooldownManager(client, message, "pet_feed_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed
        .setColor(0x000000)
        .setTitle(null)
        .setDescription("⏰ Feed your pet again **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const petHunger = row.rows[0].pet_stats_hunger;
    let petHungerToAdd = mathRandomInt(15, 30);

    if (petHunger + petHungerToAdd > 100) {
      petHungerToAdd = 100 - petHunger;
    }

    await client.database.query("UPDATE users SET pet_stats_hunger = pet_stats_hunger + $1 WHERE server_id = $2 AND user_id = $3", [
      petHungerToAdd,
      message.guildId,
      message.author.id,
    ]);

    if (petHunger + petHungerToAdd >= 100) {
      embed.setColor(0xff0000).setTitle("Full").setDescription("Your pet is not hungry");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    embed
      .setColor(0x33cc00)
      .setTitle("You fed your pet")
      .setDescription("You give some snacks to your pet")
      .setFooter({ text: "Your pet gained +" + petHungerToAdd + " hunger" });

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
