const { useMainPlayer, QueueRepeatMode } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "loopqueue",
  aliases: ["lq"],
  description: "Loops the entire music queue",
  async execute(client, message, args) {
    const lqMessageEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("Music commands are off, type: **d!musicmd on**");

    const isMusicEnabled = await configChecker(client, message, "musiCmd");
    if (isMusicEnabled == null) return;

    if (isMusicEnabled == 0) {
      try {
        return await message.reply({ embeds: [lqMessageEmbed] });
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

    const loopEnabled = queue.repeatMode === QueueRepeatMode.QUEUE;
    queue.setRepeatMode(loopEnabled ? QueueRepeatMode.OFF : QueueRepeatMode.QUEUE);

    lqMessageEmbed
      .setColor(0x33cc00)
      .setTitle("✅ Done")
      .setDescription(`Looping the queue is now **${loopEnabled ? "disabled" : "enabled"}**`);
    try {
      return await message.reply({ embeds: [lqMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
