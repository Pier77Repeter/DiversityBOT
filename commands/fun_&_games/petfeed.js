const { EmbedBuilder } = require("discord.js");
const mathRandomInt = require("../../utils/mathRandomInt");
const cooldownManager = require("../../utils/cooldownManager");

module.exports = {
  name: "petfeed",
  description: "Feed your pet",
  cooldown: 3600,
  async execute(client, message, args) {
    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT hasPet, petStatsHunger FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, message.author.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    const petFeedMessageEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("You don't have a pet, adopt it with **d!adopt <@user>**");

    if (!row || !row.hasPet) {
      try {
        return await message.reply({ embeds: [petFeedMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    const cooldown = await cooldownManager(client, message, "petFeedCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      petFeedMessageEmbed
        .setColor(0x000000)
        .setTitle(null)
        .setDescription("⏰ Feed your pet again in: **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [petFeedMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    var petHungerToAdd = mathRandomInt(15, 30);

    if (row.petStatsHunger + petHungerToAdd > 100) {
      petHungerToAdd = 100 - row.petStatsHunger;
    }

    await new Promise((resolve, reject) => {
      client.database.run(
        "UPDATE User SET petStatsHunger = petStatsHunger + ? WHERE serverId = ? AND userId = ?",
        [petHungerToAdd, message.guild.id, message.author.id],
        (err) => {
          if (err) {
            console.error("Error updating user pet hunger:", err);
            return reject(err);
          }
          resolve();
        }
      );
    });

    if (row.petStatsHunger + petHungerToAdd >= 100) {
      petFeedMessageEmbed.setColor(0xff0000).setTitle("Full").setDescription("Your pet is not hungry");

      try {
        return await message.reply({ embeds: [petFeedMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    petFeedMessageEmbed
      .setColor(0x33cc00)
      .setTitle("You fed your pet")
      .setDescription("You give some snacks to your pet")
      .setFooter({ text: "Your pet gained +" + petHungerToAdd + " hunger" });

    try {
      return await message.reply({ embeds: [petFeedMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
