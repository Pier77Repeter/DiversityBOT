const { useMainPlayer, QueueRepeatMode } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "loop",
  description: "Loops the currently playing song",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isMusicEnabled = await configChecker(client, message, "music_cmd");
    if (isMusicEnabled === null) return;

    if (!isMusicEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Music commands are off, type: **d!musicmd on**");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const player = useMainPlayer();
    const queue = player.nodes.get(message.guild.id);

    if (!queue || !queue.isPlaying()) {
      return await message.reply("There is no music currently playing in this server.").catch(msgErrorHandler);
    }

    const loopEnabled = queue.repeatMode === QueueRepeatMode.TRACK;

    queue.setRepeatMode(loopEnabled ? QueueRepeatMode.OFF : QueueRepeatMode.TRACK);

    embed
      .setColor(0x33cc00)
      .setTitle("✅ Done")
      .setDescription(`Looping the current song is now **${loopEnabled ? "disabled" : "enabled"}**`);

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
