const { EmbedBuilder } = require("discord.js");
const manageUserMoney = require("../../utils/manageUserMoney");
const cooldownManager = require("../../utils/cooldownManager");
const mathRandomInt = require("../../utils/mathRandomInt");
const delay = require("../../utils/delay");

module.exports = {
  name: "roulette",
  description: "Gambling Gambling Gambling Gambling Gambling Gambling Gambling Gambling Gambling Gambling Gambling",
  cooldown: 3600,
  async execute(client, message, args) {
    const cooldown = await cooldownManager(client, message, "rouletteCooldown", this.cooldown);
    if (cooldown == null) return;

    const embed = new EmbedBuilder();

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ You play the roulette again in: **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT money FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Failed to get your money, **report this issue with your ID**")
        .addFields({ name: "Submit here", value: "https://discord.gg/KxadTdz" });

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (isNaN(args[0]) || args[0] > row.money) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have enough money in your wallet to play the roulette, at least **1000$**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if ((await manageUserMoney(client, message, "-", args[0])) == null) return;

    var sentMessage;

    embed.setColor(0x3366ff).setTitle("🎰 Let's see").setDescription("The roulette is spinning...");

    try {
      sentMessage = await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }

    await delay(2000);

    var money;

    if (mathRandomInt(1, 5) == 1) {
      money = mathRandomInt(700, 1200) + parseInt(args[0]);
      if ((await manageUserMoney(client, message, "+", money)) == null) return;

      embed
        .setColor(0x33cc00)
        .setTitle("🤑🤑🤑 YOU WON!")
        .setDescription("You literally won **" + money + "$**! Congrats!");

      try {
        return await sentMessage.edit({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    embed
      .setColor(0xff0000)
      .setTitle("☹️ NNNNNNNNNNNOOOOOOOOOO")
      .setDescription("You lost **" + args[0] + "$**! :(((((((((");

    try {
      return await sentMessage.edit({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
