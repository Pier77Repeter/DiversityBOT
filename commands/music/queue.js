const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker.js");

module.exports = {
  name: "queue",
  aliases: ["q"],
  description: "Shows the music queue of the server",
  async execute(client, message, args) {
    const queueMessageEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("Music commands are off, type: **d!musicmd on**");

    const isMusicEnabled = await configChecker(client, message, "musiCmd");
    if (isMusicEnabled == null) return;

    if (isMusicEnabled == 0) {
      try {
        return await message.reply({ embeds: [queueMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    // get the current queue, see /music/np.js for different way to get the queue
    const queue = useQueue(message.guild.id);

    if (!queue) {
      try {
        return await message.reply("There are no songs playing in this server");
      } catch (error) {
        return;
      }
    }

    const currentTrack = queue.currentTrack;

    // get the upcoming tracks to array (it wasn't specified in the docs, so fuck you)
    const upcomingTracks = queue.tracks.toArray().slice(0, 10);

    // i just took this from discord-player docs, just mapping the array of upcoming tracks
    const upcomingTracksList = [...upcomingTracks.map((track, index) => `${index + 1}. ${track.title} - ${track.author}`)].join(
      "\n"
    );

    queueMessageEmbed
      .setColor(0xffcc66)
      .setTitle("⌚ Server music queue:")
      .setDescription("Now playing: " + currentTrack.title)
      .addFields({ name: "Upcoming tracks:", value: upcomingTracksList });

    try {
      return await message.reply({ embeds: [queueMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
