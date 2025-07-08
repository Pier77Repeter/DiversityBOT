const { GuildQueueEvent } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
  client.player.events.on(GuildQueueEvent.EmptyQueue, async (queue, track) => {
    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle("✅ Queue is over, thanks for listening!")
      .setFooter({ text: "I will now disconnect from vc in a few seconds" });

    try {
      return await queue.metadata.channel.send({ embeds: [embed] });
    } catch (error) {
      return;
    }
  });
};
