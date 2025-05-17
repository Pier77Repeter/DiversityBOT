const { useMainPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "skip",
  description: "Skips the currently playing song",
  async execute(client, message, args) {
    const skipMessageEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("Music commands are off, type: **d!musicmd on**");

    const isMusicEnabled = await configChecker(client, message, "musiCmd");
    if (isMusicEnabled == null) return;

    if (isMusicEnabled == 0) {
      try {
        return await message.reply({ embeds: [skipMessageEmbed] });
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
        return await message.reply("There is nothing to loop right now, play some songs first");
      } catch (error) {
        return;
      }
    }

    queue.node.skip();
    skipMessageEmbed.setColor(0x33ff33).setTitle("⏭️ Done").setDescription("Music skipped, you can go back with **d!back**");

    try {
      return await message.reply({ embeds: [skipMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
