const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "stop",
  description: "Stops everything",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isMusicEnabled = await configChecker(client, message, "musiCmd");
    if (isMusicEnabled == null) return;

    if (isMusicEnabled == 0) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Music commands are off, type: **d!musicmd on**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    // get the voice channel of the user
    const voiceChannel = message.member.voice.channel;

    // check if the user is in a voice channel
    if (!voiceChannel) {
      try {
        return await message.reply("You need to be in a voice channel to stop the music!");
      } catch (error) {
        return;
      }
    }

    // check if the bot is already playing in a different voice channel
    if (message.guild.members.me.voice.channel && message.guild.members.me.voice.channel !== voiceChannel) {
      try {
        return await message.reply("I am already playing in a different voice channel!");
      } catch (error) {
        return;
      }
    }

    const queue = useQueue(message.guild.id);

    queue.delete();

    embed.setColor(0x33cc00).setTitle("✅ Ok stopped, thanks for listening!").setDescription(null);

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
