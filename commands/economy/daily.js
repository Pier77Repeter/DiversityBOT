const { EmbedBuilder } = require("@discordjs/builders");
const cooldownManager = require("../../utils/cooldownManager");
const manageUserMoney = require("../../utils/manageUserMoney");

module.exports = {
  name: "daily",
  description: "Get daily reward",
  cooldown: 86400,
  async execute(client, message, args) {
    const cooldown = await cooldownManager(client, message, "daily_cooldown", this.cooldown);
    if (cooldown === null) return;

    const embed = new EmbedBuilder();

    if (cooldown) {
      embed.setColor(0x000000).setDescription("⏰ Slowdown man, next claim **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if ((await manageUserMoney(client, message, "+", 500)) === null) return;

    embed.setColor(0x33ff33).setTitle("🎁 Congratulation").setDescription("You claimed your daily reward of **500$**");

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
