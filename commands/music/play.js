const { QueryType } = require("discord-player");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const serverCooldownManager = require("../../utils/serverCooldownManager");

module.exports = {
  name: "play",
  description: "Play a song from SoundCloud, can't use Youtube",
  cooldown: 15,
  async execute(client, message, args) {
    const playMessageEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("Music commands are off, type: **d!musicmd on**");

    const isMusicEnabled = await configChecker(client, "musiCmd", message);
    if (isMusicEnabled == null) return;

    if (isMusicEnabled == 0) {
      try {
        return await message.reply({ embeds: [playMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    if (!args.length > 0) {
      playMessageEmbed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Correct usage is: **d!play <song author> <song name>**")
        .setImage("https://c.tenor.com/W_aA0wh5C4gAAAAd/tenor.gif");
      try {
        return await message.reply({ embeds: [playMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    const cooldown = await serverCooldownManager(client, "playCooldown", this.cooldown, message);
    if (cooldown == null) return;

    if (cooldown[0] == 1) {
      playMessageEmbed
        .setColor(0x000000)
        .setTitle(null)
        .setDescription("⏰ Listen some music before using **d!play** again in: **<t:" + cooldown[1] + ":R>**");
      try {
        return await message.reply({ embeds: [playMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    const query = args.join(" ");
    playMessageEmbed.setImage(null); // in case the command gets typed again correctly

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      try {
        return await message.reply("You need to be in a voice channel to play music!");
      } catch (error) {
        return;
      }
    }

    if (message.guild.members.me.voice.channel && message.guild.members.me.voice.channel !== voiceChannel) {
      try {
        return await message.reply("I am already playing in a different voice channel!");
      } catch (error) {
        return;
      }
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) {
      try {
        return await message.reply("I do not have permission to join your voice channel!");
      } catch (error) {
        return;
      }
    }

    if (!message.guild.members.me.permissionsIn(voiceChannel).has(PermissionsBitField.Flags.Speak)) {
      try {
        return await message.reply("I do not have permission to speak in your voice channel!");
      } catch (error) {
        return;
      }
    }

    var isFirstSong; // this is needed to make the fancy "Music API is connected" msg

    playMessageEmbed
      .setColor(0x666666)
      .setTitle("🔍 Searching the song...")
      .setDescription(
        "Hopefully i'm able to find the song you asked on **SoundCloud**, if it's not what you wanted try adding the song author BEFORE the song name, else just go on: **https://soundcloud.com/** and see if your song is there"
      );

    var sentMessage;
    try {
      sentMessage = await message.reply({ embeds: [playMessageEmbed] });
    } catch (error) {
      return;
    }

    const search = await client.player.search(query, {
      searchEngine: QueryType.SOUNDCLOUD,
      requestedBy: message.author,
    });

    if (!search.hasTracks()) {
      playMessageEmbed.setColor(0xff0000).setTitle("❌ Error").setDescription("No tracks has been found for your query");
      try {
        return await sentMessage.edit({ embeds: [playMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    // idk how i managed to make a functioning play command, discord player documentation SUCK SO BADLY!!!
    const queue = client.player.nodes.create(message.guild.id, {
      metadata: {
        channel: message.channel,
        client: message.guild.members.me,
      },
      selfDeaf: false,
      bufferingTimeout: 30000,
      leaveOnStop: true,
      leaveOnStopCooldown: 5000,
      leaveOnEnd: true,
      leaveOnEndCooldown: 15000,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 300000,
      skipOnNoStream: false,
    });

    // connect to vc if not connected
    if (!queue.connection) {
      await queue.connect(message.member.voice?.channelId);
      playMessageEmbed.setColor(0x666666).setTitle("⚙️ Connecting, please wait...").setDescription(null);
      isFirstSong = true; // connecting to VC
    } else {
      // already connected to vc
      playMessageEmbed.setColor(0x33cc00).setTitle("✅ Done").setDescription("Music has been added to the queue");
    }

    try {
      await sentMessage.edit({ embeds: [playMessageEmbed] });
    } catch (error) {
      return;
    }

    queue.addTrack(search.tracks[0]); // add only the first result

    try {
      await queue.node.play(queue.currentTrack); // play the current playing track, so that it won't immediatly start playing another one when added
    } catch (error) {
      try {
        playMessageEmbed.setColor(0xff0000).setTitle("❌ Error").setDescription("Something went wrong while playing the song");
        try {
          return await sentMessage.edit({ embeds: [playMessageEmbed] });
        } catch (error) {
          return;
        }
      } catch (error) {
        return;
      }
    }

    if (isFirstSong) {
      try {
        playMessageEmbed
          .setColor(0x33cc00)
          .setTitle("✅ Music API is connected")
          .setDescription("The music will now start in a few seconds!");
        await sentMessage.edit({ embeds: [playMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    isFirstSong = false; // not anymore, bot is connected to VC
  },
};
