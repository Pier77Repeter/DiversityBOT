const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const eventCooldownManager = require("../../utils/eventCooldownManager");
const mathRandomInt = require("../../utils/mathRandomInt");

module.exports = {
  name: "helpsanta",
  description: "Help santa to prepare the gifts",
  cooldown: 86400,
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isEventEnabled = await configChecker(client, message, "eventCmd");
    if (isEventEnabled == null) return;

    if (!isEventEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Event commands are off! Type **d!setup event** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const cooldown = await eventCooldownManager(client, message, "helpsantaCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ You can help Santa again **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const coins = mathRandomInt(20, 30);

    await new Promise((resolve, reject) => {
      client.database.run(
        "UPDATE Event SET goldenCoins = goldenCoins + ? WHERE serverId = ? AND userId = ?",
        [coins, message.guild.id, message.author.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    embed
      .setColor(0xffcc66)
      .setTitle("🎅 You helped Santa")
      .setDescription("For your great work on helping Santa Claus with the gifts, you received **" + coins + "** golden coins 🪙");

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
