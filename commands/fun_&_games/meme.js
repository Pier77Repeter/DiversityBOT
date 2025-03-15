const {
  EmbedBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  MessageFlags,
} = require("discord.js");

module.exports = {
  name: "meme",
  description: "Take a random meme from r/memes",
  cooldown: 15,
  async execute(client, message, args) {
    const cooldownInMs = this.cooldown * 1000;
    const unixNow = Date.now();

    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT memeCooldown FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, message.author.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!row) {
      try {
        return await message.reply("Couldn't get the meme gotta try again");
      } catch (error) {
        return;
      }
    }

    const lastCooldownInDb = row.memeCooldown;
    const expirationTime = lastCooldownInDb + cooldownInMs;

    if (unixNow < expirationTime) {
      const timeLeft = Math.floor(expirationTime / 1000);

      const memeMessageEmbed = new EmbedBuilder()
        .setColor(0x000000)
        .setDescription("⏰ Memes out of stock, wait: **<t:" + timeLeft + ":R>**");

      try {
        return await message.reply({ embeds: [memeMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    var subReddit = "";
    if (args.length > 0) {
      subReddit = args[0];
    }

    var memeData = await getMeme();
    if (memeData.code == 404) {
      try {
        return await message.reply("Subreddit not found, try again, maybe with an actual subreddit");
      } catch (error) {
        return;
      }
    }

    await new Promise((resolve, reject) => {
      client.database.run(
        "UPDATE User SET memeCooldown = ? WHERE serverId = ? AND userId = ?",
        [unixNow, message.guild.id, message.author.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    if (memeData.nsfw) {
      const imageFile = new AttachmentBuilder("./media/arnoldSchwarzeneggerStopMeme.jpg");

      const memeMessageEmbed = new EmbedBuilder()
        .setColor(0xcc0000)
        .setTitle("STOP RIGHT THERE!")
        .setDescription(
          "The post i was about to send is NSFW, luckily i've blocked it for your safety, if you are trying to get posts from NSFW subs, well, you can't!"
        )
        .setImage("attachment://arnoldSchwarzeneggerStopMeme.jpg");

      try {
        return await message.reply({ embeds: [memeMessageEmbed], files: [imageFile] });
      } catch (error) {
        return;
      }
    }

    const memeMessageEmbed = new EmbedBuilder()
      .setColor(0xffcc00)
      .setTitle(memeData.title)
      .setDescription("From: r/" + memeData.subreddit + " | " + memeData.postLink)
      .setImage(memeData.url)
      .setFooter({ text: "Upvotes: " + memeData.ups + " 👍" });

    const btnNextMeme = new ButtonBuilder()
      .setCustomId("btn-meme-btnNextMeme")
      .setEmoji("🔄")
      .setLabel("Next Meme")
      .setStyle(ButtonStyle.Primary);
    const btnStop = new ButtonBuilder()
      .setCustomId("btn-meme-btnStop")
      .setEmoji("🛑")
      .setLabel("Stop")
      .setStyle(ButtonStyle.Danger);
    const btnRow = new ActionRowBuilder().addComponents(btnNextMeme, btnStop);

    var reply;
    try {
      reply = await message.reply({ embeds: [memeMessageEmbed], components: [btnRow] });
    } catch (error) {
      return;
    }

    const btnCollector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000,
    });

    btnCollector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await btnInteraction.reply({ content: "You gotta type d!meme for yourself", flags: MessageFlags.Ephemeral });
        } catch (error) {
          return;
        }
      }

      switch (btnInteraction.customId) {
        case "btn-meme-btnNextMeme":
          memeData = await getMeme();
          if (memeData.code == 404) {
            try {
              return await btnInteraction.update("Opsy, i couldn't get the meme, try typing the command again");
            } catch (error) {
              return;
            }
          }
          if (memeData.nsfw) {
            const imageFile = new AttachmentBuilder("./media/arnoldSchwarzeneggerStopMeme.jpg");

            const memeMessageEmbed = new EmbedBuilder()
              .setColor(0xcc0000)
              .setTitle("STOP RIGHT THERE!")
              .setDescription(
                "The post i was about to send is NSFW, luckily i've blocked it for your safety, if you are trying to get posts from NSFW subs, well, you can't!"
              )
              .setImage("attachment://arnoldSchwarzeneggerStopMeme.jpg");

            btnCollector.stop();

            try {
              return await btnInteraction.update({ embeds: [memeMessageEmbed], files: [imageFile] });
            } catch (error) {
              return;
            }
          }

          memeMessageEmbed
            .setColor(0xffcc00)
            .setTitle(memeData.title)
            .setDescription("From: **r/" + memeData.subreddit + "** | " + memeData.postLink)
            .setImage(memeData.url)
            .setFooter({ text: "Upvotes: " + memeData.ups + " 👍" });

          btnCollector.resetTimer();

          try {
            await btnInteraction.update({ embeds: [memeMessageEmbed], components: [btnRow] });
          } catch (error) {
            return;
          }

          break;

        case "btn-meme-btnStop":
          btnNextMeme.setDisabled(true);
          btnStop.setDisabled(true);

          try {
            await btnInteraction.update({ embeds: [memeMessageEmbed], components: [btnRow] });
          } catch (error) {
            return;
          }

          break;
      }
    });

    btnCollector.on("end", async () => {
      btnNextMeme.setDisabled(true);
      btnStop.setDisabled(true);

      try {
        return await reply.edit({ embeds: [memeMessageEmbed], components: [btnRow] });
      } catch (error) {
        return;
      }
    });

    async function getMeme() {
      try {
        const response = await fetch("https://meme-api.com/gimme/" + subReddit);
        const memeData = await response.json();

        return memeData;
      } catch (err) {
        return;
      }
    }
  },
};
