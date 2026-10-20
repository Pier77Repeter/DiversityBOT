const { useMainPlayer, useHistory } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "lyric",
  description: "Find the lyrics of a given song",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isMusicEnabled = await configChecker(client, message, "music_cmd");
    if (isMusicEnabled === null) return;

    if (!isMusicEnabled) {
      embed
        .setColor("DarkRed") // NEW way of colouring embeds! I like it! May i look a bit different
        .setTitle("❌ Error")
        .setDescription("Music commands are off, type: **d!musicmd on**");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (args.length < 1) {
      embed.setColor("DarkRed").setTitle("❌ Missing Name").setDescription("Please provide the name of the song");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const player = useMainPlayer();

    const lyrics = await player.lyrics.search({
      q: args,
    });

    if (!lyrics.length) {
      embed.setColor("DarkRed").setTitle("❌ Not Found").setDescription("The song's lyrics have not been found");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const trimmedLyrics = lyrics[0].plainLyrics.substring(0, 1997);

    embed
      .setColor("Yellow")
      .setTitle(lyrics[0].name)
      .setURL(lyrics[0].url)
      .setThumbnail(lyrics[0].thumbnail)

      .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
      .setFooter({ text: "Artist " + lyrics[0].artistName });

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
