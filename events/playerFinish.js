const { GuildQueueEvent } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
  const logPrefix = "[PlayerStart]: ";

  client.player.events.on(GuildQueueEvent.EmptyQueue, async (queue, track) => {
    const playerFinishEventMessageEmbed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle("✅ Queue is over, thanks for listening!")
      .setFooter({ text: "I will now disconnect from vc in a few seconds" });

    try {
      return await queue.metadata.channel.send({ embeds: [playerFinishEventMessageEmbed] });
    } catch (error) {
      return;
    }
  });
};
