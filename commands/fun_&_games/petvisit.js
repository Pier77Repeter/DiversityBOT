const { EmbedBuilder } = require("discord.js");
const mathRandomInt = require("../../utils/mathRandomInt");
const cooldownManager = require("../../utils/cooldownManager");

module.exports = {
  name: "petvisit",
  description: "Bring your pet to the vet",
  cooldown: 3600,
  async execute(client, message, args) {
    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT hasPet, petStatsHealth FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, message.author.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    const petVisitMessageEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("You don't have a pet, adopt it with **d!adopt <@user>**");

    if (!row.hasPet) {
      try {
        return await message.reply({ embeds: [petVisitMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    const cooldown = await cooldownManager(client, "petVetCooldown", this.cooldown, message.guild.id, message.author.id);

    if (cooldown == null) {
      try {
        return await message.reply("The vet isn't available right now, try again later");
      } catch (error) {
        return;
      }
    }

    if (cooldown[0] == 1) {
      petVisitMessageEmbed
        .setColor(0x000000)
        .setTitle(null)
        .setDescription("⏰ Slowdown man, vet will be available again: **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [petVisitMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    var petHealthToAdd = mathRandomInt(15, 30);

    if (row.petStatsHealth + petHealthToAdd > 100) {
      petHealthToAdd = 100 - row.petStatsHealth;
    }

    await new Promise((resolve, reject) => {
      client.database.run(
        "UPDATE User SET petStatsHealth = petStatsHealth + ? WHERE serverId = ? AND userId = ?",
        [petHealthToAdd, message.guild.id, message.author.id],
        (err) => {
          if (err) {
            console.error("Error updating user pet health:", err);
            return reject(err);
          }
          resolve();
        }
      );
    });

    if (row.petStatsHealth + petHealthToAdd >= 100) {
      petVisitMessageEmbed
        .setColor(0xff0000)
        .setTitle("Your pet is fine")
        .setDescription("Your pet is healty, no need to bring it to the vet");

      try {
        return await message.reply({ embeds: [petVisitMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    petVisitMessageEmbed
      .setColor(0x33cc00)
      .setTitle("You broght your pet to the vet")
      .setDescription("The vet visited your pet giving the right treatment")
      .setFooter({ text: "Your pet gained +" + petHealthToAdd + " health" });

    try {
      return await message.reply({ embeds: [petVisitMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
