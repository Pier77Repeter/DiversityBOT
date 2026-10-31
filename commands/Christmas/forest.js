const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const eventCooldownManager = require("../../utils/eventCooldownManager");
const mathRandomInt = require("../../utils/mathRandomInt");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "forest",
  description: "Go in the forest to collect the materials",
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

    const cooldown = await eventCooldownManager(client, message, "forest_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed.setColor(0x000000).setDescription(`⏰ You can go to the forest again **<t:${cooldown[1]}:R>**`);

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const twigs = mathRandomInt(40, 60);
    const leaves = mathRandomInt(50, 70);

    await client.database.query("UPDATE events SET twigs = twigs + $1, leaves = leaves + $2 WHERE server_id = $3 AND user_id = $4", [
      twigs,
      leaves,
      message.guildId,
      message.author.id,
    ]);

    embed.setColor(0x33cc00).setTitle("🌳🌲 Back from the forest").setDescription(`You came back and got **${twigs}** 🪵 and **${leaves}** 🌿`);

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
