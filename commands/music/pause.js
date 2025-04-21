const { useMainPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "pause",
  description: "Pauses the currently playing song",
  async execute(client, message, args) {
    const pauseMessageEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("Music commands are off, type: **d!musicmd on**");

    const isMusicEnabled = await configChecker(client, "musiCmd", message.guild.id);

    if (isMusicEnabled == null) {
      pauseMessageEmbed.setDescription("There was an error checking the configs, try again later");
      try {
        return await message.reply({ embeds: [pauseMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    if (isMusicEnabled == 0) {
      try {
        return await message.reply({ embeds: [pauseMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    if (!message.member.voice.channel) {
      try {
        return await message.reply("You need to be in a voice channel to use this command!");
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

    queue.node.pause();
    pauseMessageEmbed.setColor(0xcc0000).setTitle("⏸️ Music paused").setDescription("Resume playing with **d!resume**");

    try {
      return await message.reply({ embeds: [pauseMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
