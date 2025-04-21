const { useMainPlayer, useHistory } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "back",
  description: "Plays the previous song in the queue",
  async execute(client, message, args) {
    const backMessageEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("Music commands are off, type: **d!musicmd on**");

    const isMusicEnabled = await configChecker(client, "musiCmd", message.guild.id);

    if (isMusicEnabled == null) {
      backMessageEmbed.setDescription("There was an error checking the configs, try again later");
      try {
        return await message.reply({ embeds: [backMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    if (isMusicEnabled == 0) {
      try {
        return await message.reply({ embeds: [backMessageEmbed] });
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
    backMessageEmbed.setColor(0x33cc00).setTitle("⏮️ Playing previous music").setDescription("Skip with **d!skip**");

    try {
      return await message.reply({ embeds: [backMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
