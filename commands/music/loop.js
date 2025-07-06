const { useMainPlayer, QueueRepeatMode } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "loop",
  description: "Loops the currently playing song",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isMusicEnabled = await configChecker(client, message, "musiCmd");
    if (isMusicEnabled == null) return;

    if (isMusicEnabled == 0) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Music commands are off, type: **d!musicmd on**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const player = useMainPlayer();
    const queue = player.nodes.get(message.guild.id);

    if (!queue || !queue.isPlaying()) {
      try {
        return await message.reply("There is no music currently playing in this server.");
      } catch (error) {
        return;
      }
    }

    const loopEnabled = queue.repeatMode === QueueRepeatMode.TRACK;
    queue.setRepeatMode(loopEnabled ? QueueRepeatMode.OFF : QueueRepeatMode.TRACK);

    embed
      .setColor(0x33cc00)
      .setTitle("✅ Done")
      .setDescription(`Looping the current song is now **${loopEnabled ? "disabled" : "enabled"}**`);

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
