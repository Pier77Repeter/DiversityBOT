const { EmbedBuilder } = require("discord.js");
const manageUserMoney = require("../../utils/manageUserMoney");
const cooldownManager = require("../../utils/cooldownManager");
const mathRandomInt = require("../../utils/mathRandomInt");
const delay = require("../../utils/delay");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "roulette",
  description: "Gambling Gambling Gambling Gambling Gambling Gambling Gambling Gambling Gambling Gambling Gambling",
  cooldown: 3600,
  async execute(client, message, args) {
    const cooldown = await cooldownManager(client, message, "roulette_cooldown", this.cooldown);
    if (cooldown === null) return;

    const embed = new EmbedBuilder();

    if (cooldown) {
      embed.setColor(0x000000).setDescription(`⏰ You play the roulette again **<t:${cooldown[1]}:R>**`);

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const row = await client.database.query("SELECT money FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

    if (row.rowCount === 0) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Failed to get your money, **report this issue with your ID**")
        .addFields({ name: "Submit here", value: "https://discord.gg/KxadTdz" });

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (isNaN(args[0]) || args[0] > row.money) {
      embed.setColor(0xff0000).setTitle("❌ Missing Money").setDescription("You don't have enough money in your wallet to play the roulette, at least **1000$**");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if ((await manageUserMoney(client, message, "-", args[0])) === null) return;

    embed.setColor(0x3366ff).setTitle("🎰 Let's See").setDescription("The roulette is spinning...");

    const sentMessage = await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    if (!sentMessage) return;

    await delay(2000);

    let money;

    if (mathRandomInt(1, 5) === 1) {
      // yes, you will lose more money than you bet >:(
      money = mathRandomInt(700, 1200) + parseInt(args[0]);

      if ((await manageUserMoney(client, message, "+", money)) === null) return;

      embed.setColor(0x33cc00).setTitle("🤑🤑🤑 YOU WON!").setDescription(`You literally won **${money}$**! Congrats!`);

      return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);
    }

    embed.setColor(0xff0000).setTitle("☹️ NNNNNNNNNNNOOOOOOOOOO").setDescription(`You lost **${args[0]}$**! :(((((((((`);

    return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
