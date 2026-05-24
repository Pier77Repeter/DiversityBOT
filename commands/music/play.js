const { SoundCloudExtractor } = require("@discord-player/extractor");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const configChecker = require("../../utils/configChecker");
const serverCooldownManager = require("../../utils/serverCooldownManager");

module.exports = {
  name: "play",
  description: "Play a song from SoundCloud, can't use Youtube",
  cooldown: 15,
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

    if (!args.length > 0) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Correct usage is: **d!play <song author> <song name>**")
        .setImage("https://c.tenor.com/W_aA0wh5C4gAAAAd/tenor.gif");
      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const cooldown = await serverCooldownManager(client, message, "play_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed
        .setColor(0x000000)
        .setTitle(null)
        .setDescription("⏰ Listen some music before using **d!play** again in: **<t:" + cooldown[1] + ":R>**");
      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const query = args.join(" ");
    embed.setImage(null); // in case the command gets typed again correctly

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      try {
        return await message.reply("You need to be in a voice channel to play music!");
      } catch {
        return;
      }
    }

    if (message.guild.members.me.voice.channel && message.guild.members.me.voice.channel !== voiceChannel) {
      try {
        return await message.reply("I am already playing in a different voice channel!");
      } catch {
        return;
      }
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) {
      try {
        return await message.reply("I do not have permission to join your voice channel!");
      } catch {
        return;
      }
    }

    if (!message.guild.members.me.permissionsIn(voiceChannel).has(PermissionsBitField.Flags.Speak)) {
      try {
        return await message.reply("I do not have permission to speak in your voice channel!");
      } catch {
        return;
      }
    }

    let isFirstSong; // this is needed to make the fancy "Music API is connected" msg

    embed
      .setColor(0x666666)
      .setTitle("🔍 Searching the song...")
      .setDescription(
        "Hopefully i'm able to find the song you asked on **SoundCloud**, if it's not what you wanted try adding the song author BEFORE the song name, else just go on **https://soundcloud.com/** and see if your song is there",
      );

    let sentMessage;
    try {
      sentMessage = await message.reply({ embeds: [embed] });
    } catch {
      return;
    }

    const player = useMainPlayer();

    const search = await player.search(query, {
      searchEngine: `ext:${SoundCloudExtractor.identifier}`,
      requestedBy: message.author,
    });

    if (!search.hasTracks()) {
      embed.setColor(0xff0000).setTitle("❌ Not Found").setDescription("No track was found for your query.");
      try {
        return await sentMessage.edit({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const queue =
      player.nodes.get(message.guild.id) ||
      player.nodes.create(message.guild.id, {
        metadata: {
          channel: message.channel,
          client: message.guild.members.me,
        },
        selfDeaf: true,
        leaveOnStop: true,
        leaveOnStopCooldown: 5000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 15000,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 300000,
      });

    // connect to vc if not connected
    if (!queue.connection) {
      try {
        await queue.connect(message.member.voice?.channelId);
      } catch {
        // rip, couldnt connect to vc
        embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Failed to connect to your voice channel, check if i have the permission to connect");

        try {
          return await sentMessage.edit({ embeds: [embed] });
        } catch {
          return;
        }
      }

      isFirstSong = true; // connecting to VC
      embed.setColor(0x666666).setTitle("⚙️ Connecting, please wait...");
    } else {
      // already connected to vc
      embed.setColor(0x33cc00).setTitle("✅ Done").setDescription("Music has been added to the queue");
    }

    try {
      await sentMessage.edit({ embeds: [embed] });
    } catch {
      return;
    }

    // add only the first result
    const track = search.tracks[0];

    try {
      // await queue.node.play(track);
      // play the current playing track, so that it won't immediatly start playing another one when added
      await player.play(voiceChannel, track, {
        nodeOptions: {
          metadata: {
            channel: message.channel,
            client: message.guild.members.me,
            requestedBy: message.user,
          },
        },
      });
    } catch {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Something went wrong while playing the song");

      try {
        return await sentMessage.edit({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (isFirstSong) {
      isFirstSong = false; // not anymore, bot is connected to VC
      embed.setColor(0x33cc00).setTitle("✅ Music API is connected").setDescription("The music will now start in a few seconds!");

      try {
        return await sentMessage.edit({ embeds: [embed] });
      } catch {
        return;
      }
    }
  },
};
