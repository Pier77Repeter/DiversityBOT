const { GuildQueueEvent, useMainPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("PlayerError");

// when errors happens so that it dosen't vomit 1000 console errors
module.exports = (client) => {
  const player = useMainPlayer();

  player.events.on(GuildQueueEvent.PlayerError, async (queue, error) => {
    logger.error("Error while playing a track", error);

    const embed = new EmbedBuilder();

    embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I couldn't play that track. It's likely protected or unavailable in my region");

    try {
      return await queue.metadata.channel.send({ embeds: [embed] });
    } catch (error) {
      return;
    }
  });
};
