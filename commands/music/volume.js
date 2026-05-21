const { useMainPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "volume",
  description: "Sets the playback volume (0-100)",
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

    const volumeArg = parseInt(args[0]);

    if (isNaN(volumeArg) || volumeArg < 0 || volumeArg > 100) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Please provide a valid volume level between **0 and 100**");
      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    queue.node.setVolume(volumeArg);

    embed
      .setColor(0x33cc00)
      .setTitle("🎚️ Done")
      .setDescription("🔊 Volume set to **" + volumeArg + "%**");

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
