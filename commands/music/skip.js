const { useMainPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "skip",
  description: "Skips the currently playing song",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isMusicEnabled = await configChecker(client, message, "music_cmd");
    if (isMusicEnabled === null) return;

    if (!isMusicEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Music commands are off, type: **d!musicmd on**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.member.voice.channel) {
      return await message.reply("You need to be in a voice channel to use this command!").catch(msgErrorHandler);
    }

    const player = useMainPlayer();
    const queue = player.nodes.get(message.guild.id);

    if (!queue || !queue.isPlaying()) {
      return await message.reply("There is nothing to loop right now, play some songs first").catch(msgErrorHandler);
    }

    queue.node.skip();

    embed.setColor(0x33ff33).setTitle("⏭️ Done").setDescription("Music skipped, you can go back with **d!back**");

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
