const { GuildQueueEvent } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
  const logPrefix = "[PlayerStart]: ";

  client.player.events.on(GuildQueueEvent.PlayerStart, async (queue, track) => {
    const playerStartEventMessageEmbed = new EmbedBuilder();
    try {
      playerStartEventMessageEmbed
        .setColor(0xcc66cc)
        .setTitle(track.title)
        .setDescription(
          [
            "Author: **" + track.author + "**",
            "\n",
            "Description: **" + track.description + "**",
            "\n",
            "Duration: **" + track.duration + "**",
            "\n",
            "Views: **" + track.views + "**",
            "\n",
            "Url: **" + track.url + "**",
            "\n",
            "Requested by: **" + track.requestedBy.username + "**",
          ].join("")
        )
        .setImage(track.thumbnail)
        .setFooter({ text: "Offered by SoundCloud" });
    } catch (error) {
      playerStartEventMessageEmbed
        .setColor(0xcc66cc)
        .setTitle(track.title)
        .setDescription(
          [
            "Author: **" + track.author + "**",
            "\n",
            "Description: **" + track.description + "**",
            "\n",
            "Duration: **" + track.duration + "**",
            "\n",
            "Views: **" + track.views + "**",
            "\n",
            "Requested by: **" + track.requestedBy.username + "**",
          ].join("")
        )
        .setFooter({ text: "Offered by SoundCloud" });
    }

    try {
      return await queue.metadata.channel.send({ embeds: [playerStartEventMessageEmbed] });
    } catch (error) {
      return;
    }
  });
};
