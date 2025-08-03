const { EmbedBuilder } = require("discord.js");
const mathRandomInt = require("../../utils/mathRandomInt");
const cooldownManager = require("../../utils/cooldownManager");

module.exports = {
  name: "petdrink",
  description: "Give water to your pet",
  cooldown: 3600,
  async execute(client, message, args) {
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT hasPet, petStatsThirst FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const embed = new EmbedBuilder();

    if (!row || !row.hasPet) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have a pet, adopt it with **d!adopt <@user>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const cooldown = await cooldownManager(client, message, "petDrinkCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed
        .setColor(0x000000)
        .setTitle(null)
        .setDescription("⏰ Give water to your pet **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    var petThirstToAdd = mathRandomInt(15, 30);

    if (row.petStatsThirst + petThirstToAdd > 100) {
      petThirstToAdd = 100 - row.petStatsThirst;
    }

    await new Promise((resolve, reject) => {
      client.database.run(
        "UPDATE User SET petStatsThirst = petStatsThirst + ? WHERE serverId = ? AND userId = ?",
        [petThirstToAdd, message.guild.id, message.author.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    if (row.petStatsThirst + petThirstToAdd >= 100) {
      embed.setColor(0xff0000).setTitle("Water").setDescription("Your pet is not thirsty");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
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
    } catch (error) {
      return;
    }
  },
};
