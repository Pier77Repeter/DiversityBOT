const { EmbedBuilder } = require("discord.js");
const mathRandomInt = require("../../utils/mathRandomInt");
const cooldownManager = require("../../utils/cooldownManager");

module.exports = {
  name: "petdrink",
  description: "Give water to your pet",
  cooldown: 3600,
  async execute(client, message, args) {
    const row = await client.database.query("SELECT has_pet, pet_stats_thirst FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

    const embed = new EmbedBuilder();

    if (row.rowCount === 0 || !row.rows[0].has_pet) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have a pet, adopt it with **d!adopt <@user>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const cooldown = await cooldownManager(client, message, "pet_drink_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed
        .setColor(0x000000)
        .setTitle(null)
        .setDescription("⏰ Give water to your pet **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const petThirst = row.rows[0].pet_stats_thirst;
    let petThirstToAdd = mathRandomInt(15, 30);

    if (petThirst + petThirstToAdd > 100) {
      petThirstToAdd = 100 - petThirst;
    }

    await client.database.query("UPDATE users SET pet_stats_thirst = pet_stats_thirst + $1 WHERE server_id = $2 AND user_id = $3", [
      petThirstToAdd,
      message.guildId,
      message.author.id,
    ]);

    if (petThirst + petThirstToAdd >= 100) {
      embed.setColor(0xff0000).setTitle("Water").setDescription("Your pet is not thirsty");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    embed
      .setColor(0x33cc00)
      .setTitle("You gave water to your pet")
      .setDescription("Your pet now feel more refreshed after drinking fresh water")
      .setFooter({ text: "Your pet gained +" + petThirstToAdd + " thirst" });

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
