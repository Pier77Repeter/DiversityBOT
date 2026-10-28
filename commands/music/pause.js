const { useMainPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "pause",
  description: "Pauses the currently playing song",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isMusicEnabled = await configChecker(client, message, "music_cmd");
    if (isMusicEnabled === null) return;

    if (!isMusicEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Music commands are off, type: **d!musicmd on**");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!message.member.voice.channel) {
      message.reply("You need to be in a voice channel to use this command!").catch(msgErrorHandler);
      return;
    }

    const player = useMainPlayer();
    const queue = player.nodes.get(message.guild.id);

    if (!queue || !queue.isPlaying()) {
      message.reply("There is no music currently playing in this server.").catch(msgErrorHandler);
      return;
    }

    queue.node.pause();

    embed.setColor(0xcc0000).setTitle("⏸️ Music Paused").setDescription("Resume playing with **d!resume**");

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
