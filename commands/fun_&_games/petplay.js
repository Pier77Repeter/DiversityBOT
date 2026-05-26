const { EmbedBuilder } = require("discord.js");
const mathRandomInt = require("../../utils/mathRandomInt");
const cooldownManager = require("../../utils/cooldownManager");

module.exports = {
  name: "petplay",
  description: "Play with your pet",
  cooldown: 3600,
  async execute(client, message, args) {
    const row = await client.database.query("SELECT has_pet, pet_stats_fun FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

    const embed = new EmbedBuilder();

    if (row.rowCount === 0 || !row.rows[0].has_pet) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have a pet, adopt it with **d!adopt <@user>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const cooldown = await cooldownManager(client, message, "pet_play_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed
        .setColor(0x000000)
        .setTitle(null)
        .setDescription("⏰ Play with your pet again **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const petFun = row.rows[0].pet_stats_fun;
    let petFunToAdd = mathRandomInt(15, 30);

    if (petFun + petFunToAdd > 100) {
      petFunToAdd = 100 - petFun;
    }

    await client.database.query("UPDATE users SET pet_stats_fun = pet_stats_fun + $1 WHERE server_id = $2 AND user_id = $3", [petFunToAdd, message.guildId, message.author.id]);

    if (petFun + petFunToAdd >= 100) {
      embed.setColor(0xff0000).setTitle("Already happy").setDescription("Your pet is not getting bored");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    embed
      .setColor(0x33cc00)
      .setTitle("You played with your pet")
      .setDescription("Your pet was really happy to play with you")
      .setFooter({ text: "Your pet gained +" + petFunToAdd + " fun" });

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
