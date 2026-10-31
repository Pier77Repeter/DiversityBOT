const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const eventCooldownManager = require("../../utils/eventCooldownManager");
const mathRandomInt = require("../../utils/mathRandomInt");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "helpsanta",
  description: "Help santa to prepare the gifts",
  cooldown: 86400,
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isEventEnabled = await configChecker(client, message, "event_cmd");
    if (isEventEnabled === null) return;

    if (!isEventEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Event commands are off! Type **d!setup event** to enable them");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const cooldown = await eventCooldownManager(client, message, "helpsanta_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed.setColor(0x000000).setDescription(`⏰ You can help Santa again **<t:${cooldown[1]}:R>**`);

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const coins = mathRandomInt(20, 30);

    await client.database.query("UPDATE events SET golden_coins = golden_coins + $1 WHERE server_id = $2 AND user_id = $3", [coins, message.guildId, message.author.id]);

    embed.setColor(0xffcc66).setTitle("🎅 You Helped Santa").setDescription(`For your great work on helping Santa Claus with the gifts, you received **${coins}** 🪙`);

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
