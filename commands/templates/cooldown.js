const { EmbedBuilder } = require("discord.js");
const cooldownManager = require("../../utils/cooldownManager");

module.exports = {
  name: "cooldown",
  description: "Cooldown example, db table is fake",
  cooldown: 30, // cooldown in seconds
  async execute(client, message, args) {
    // for every cooldown, we'll use the cooldownManager, take a look into it at: utils/cooldownManager.js
    const cooldown = await cooldownManager(client, "dailyCooldown", this.cooldown, message.guild.id, message.author.id);
    if (cooldown == null) return; // check cooldownManager.js PLEASE, if cooldown is null than shit happened, so command execution must be stopped

    // if everything went gut, the return value is this: cooldownData = [statusCode, timeLeft]
    if (cooldown != 0) {
      const cooldownMessageEmbed = new EmbedBuilder()
        .setColor(0x000000)
        .setDescription("⏰ WAIT: **<t:" + cooldown[1] + ":R>** to use this again");

      try {
        return await message.reply({ embeds: [cooldownMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    // command logic here
    try {
      return await message.reply("Congrats, you just used the: **" + this.name + "** command");
    } catch (error) {
      return;
    }
  },
};
