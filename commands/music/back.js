const { useMainPlayer, useHistory } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "back",
  description: "Plays the previous song in the queue",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    // take a look into configChecker to know what's going on
    const isMusicEnabled = await configChecker(client, message, "musiCmd");
    if (isMusicEnabled == null) return; // put return so that commands execution stops when there's an error

    if (isMusicEnabled == 0) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Music commands are off, type: **d!musicmd on**");

      try {
        return await message.reply({ embeds: [embed] });
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
    const history = useHistory(message.guild.id);

    if (!queue || !queue.isPlaying()) {
      try {
        return await message.reply("There is nothing to loop right now, play some songs first");
      } catch (error) {
        return;
      }
    }

    await history.previous();

    embed.setColor(0x33cc00).setTitle("⏮️ Playing previous music").setDescription("Skip with **d!skip**");

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
