const { useMainPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "pause",
  description: "Pauses the currently playing song",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isMusicEnabled = await configChecker(client, message, "music_cmd");
    if (isMusicEnabled === null) return;

    if (!isMusicEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Music commands are off, type: **d!musicmd on**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (!message.member.voice.channel) {
      try {
        return await message.reply("You need to be in a voice channel to use this command!");
      } catch {
        return;
      }
    }

    const player = useMainPlayer();
    const queue = player.nodes.get(message.guild.id);

    if (!queue || !queue.isPlaying()) {
      try {
        return await message.reply("There is no music currently playing in this server.");
      } catch {
        return;
      }
    }

    queue.node.pause();

    embed.setColor(0xcc0000).setTitle("⏸️ Music paused").setDescription("Resume playing with **d!resume**");

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
