const { EmbedBuilder } = require("discord.js");
const mathRandomInt = require("../../utils/mathRandomInt");
const cooldownManager = require("../../utils/cooldownManager");

module.exports = {
  name: "petplay",
  description: "Play with your pet",
  cooldown: 3600,
  async execute(client, message, args) {
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT hasPet, petStatsFun FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
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

    const cooldown = await cooldownManager(client, message, "petPlayCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed
        .setColor(0x000000)
        .setTitle(null)
        .setDescription("⏰ Play with your pet again in: **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    var petFunToAdd = mathRandomInt(15, 30);

    if (row.petStatsFun + petFunToAdd > 100) {
      petFunToAdd = 100 - row.petStatsFun;
    }

    await new Promise((resolve, reject) => {
      client.database.run(
        "UPDATE User SET petStatsFun = petStatsFun + ? WHERE serverId = ? AND userId = ?",
        [petFunToAdd, message.guild.id, message.author.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    if (row.petStatsFun + petFunToAdd >= 100) {
      embed.setColor(0xff0000).setTitle("Already happy").setDescription("Your pet is not getting bored");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
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
    } catch (error) {
      return;
    }
  },
};
