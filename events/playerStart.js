const { GuildQueueEvent, QueueRepeatMode } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
  client.player.events.on(GuildQueueEvent.PlayerStart, async (queue, track) => {
    const loopEnabled = queue.repeatMode === QueueRepeatMode.TRACK;
    const queueLoopEnabled = queue.repeatMode === QueueRepeatMode.QUEUE;
    if (loopEnabled || queueLoopEnabled) return;

    const embed = new EmbedBuilder();
    try {
      embed
        .setColor(0xcc66cc)
        .setTitle(track.title)
        .setDescription(
          [
            "Author: **" + track.author + "**",
            "Description: **" + track.description + "**",
            "Duration: **" + track.duration + "**",
            "Views: **" + track.views + "**",
            "Url: **" + track.url + "**",
            "Requested by: **" + track.requestedBy.username + "**",
          ].join("\n")
        )
        .setImage(track.thumbnail)
        .setFooter({ text: "If this song instantly stops, it's because of COPYRIGHT issues" });
    } catch (error) {
      embed
        .setColor(0xcc66cc)
        .setTitle(track.title)
        .setDescription(
          [
            "Author: **" + track.author + "**",
            "Description: **" + track.description + "**",
            "Duration: **" + track.duration + "**",
            "Views: **" + track.views + "**",
            "Requested by: **" + track.requestedBy.username + "**",
          ].join("\n")
        )
        .setFooter({ text: "If this song instantly stops, it's because of COPYRIGHT issues" });
    }

    try {
      return await queue.metadata.channel.send({ embeds: [embed] });
    } catch (error) {
      return;
    }
  });
};
