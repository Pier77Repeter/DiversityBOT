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

    const isEventEnabled = await configChecker(client, message, "eventCmd");
    if (isEventEnabled == null) return;

    if (!isEventEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Event commands are off! Type **d!setup event** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    const cooldown = await eventCooldownManager(client, message, "forestCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ You can go to the forest again **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    const twigs = mathRandomInt(40, 60);
    const leaves = mathRandomInt(50, 70);

    await new Promise((resolve, reject) => {
      client.database.run(
        "UPDATE Event SET twigs = twigs + ?, leaves = leaves + ? WHERE serverId = ? AND userId = ?",
        [twigs, leaves, message.guild.id, message.author.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        },
      );
    });

    embed
      .setColor(0x33cc00)
      .setTitle("🌳🌲 Back from the forest")
      .setDescription("You came back and got **" + twigs + "**🪵 and **" + leaves + "**🌿");

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return msgErrorHandler(error);
    }
  },
};
