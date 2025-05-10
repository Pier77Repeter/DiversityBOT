const { useMainPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  description: "Shows the currently playing song.",
  async execute(client, message, args) {
    const npMessageEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("Music commands are off, type: **d!musicmd on**");

    const isMusicEnabled = await configChecker(client, "musiCmd", message);
    if (isMusicEnabled == null) return;

    if (isMusicEnabled == 0) {
      try {
        return await message.reply({ embeds: [npMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    // you can also do this instead of client.player, wow
    const player = useMainPlayer();
    // and also do this to get the queue instead of useQueue()
    const queue = player.nodes.get(message.guild.id);

    if (!queue || !queue.isPlaying()) {
      try {
        return await message.reply("There is no music currently playing in this server.");
      } catch (error) {
        return;
      }
    }

    const currentTrack = queue.currentTrack;
    const progressBar = queue.node.createProgressBar({
      length: 15,
      indicator: "🔘",
      line: "▬",
      timecodes: true,
    });

    npMessageEmbed
      .setColor(0x00b0ff)
      .setTitle("🎶 Now Playing")
      .setDescription(`**${currentTrack.title}** by ${currentTrack.author}\n${progressBar}`)
      .setURL(currentTrack.url)
      .setThumbnail(currentTrack.thumbnail)
      .setFooter({ text: `Requested by ${currentTrack.requestedBy.tag}` });

    try {
      return await message.reply({ embeds: [npMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
