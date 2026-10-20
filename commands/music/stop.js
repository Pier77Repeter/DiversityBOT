const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "stop",
  description: "Stops everything",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isMusicEnabled = await configChecker(client, message, "music_cmd");
    if (isMusicEnabled === null) return;

    if (!isMusicEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Music commands are off, type: **d!musicmd on**");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    // get the voice channel of the user
    const voiceChannel = message.member.voice.channel;

    // check if the user is in a voice channel
    if (!voiceChannel) {
      return await message.reply("You need to be in a voice channel to stop the music!").catch(msgErrorHandler);
    }

    // check if the bot is already playing in a different voice channel
    if (message.guild.members.me.voice.channel && message.guild.members.me.voice.channel !== voiceChannel) {
      return await message.reply("I am already playing in a different voice channel!").catch(msgErrorHandler);
    }

    const queue = useQueue(message.guild.id);

    if (!queue) {
      return await message.reply("There's no music queue to stop here!").catch(msgErrorHandler);
    }

    queue.delete();

    embed.setColor(0x33cc00).setTitle("✅ Ok stopped, thanks for listening!").setDescription(null);

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
