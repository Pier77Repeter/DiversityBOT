const { EmbedBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags } = require("discord.js");
const cooldownManager = require("../../utils/cooldownManager");

module.exports = {
  name: "meme",
  description: "Take a random meme from r/memes",
  cooldown: 30,
  async execute(client, message, args) {
    const embed = new EmbedBuilder();
    const imageFile = new AttachmentBuilder();

    const cooldown = await cooldownManager(client, message, "memeCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ Memes out of stock, come back **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
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

    // some subs are privated
    if (memeData.code == 403) {
      try {
        return await message.reply("Subreddit is set to private, i can't get anything from there");
      } catch (error) {
        return;
      }
    }

    if (memeData.nsfw) {
      imageFile.setFile("./media/arnoldSchwarzeneggerStopMeme.jpg");

      embed
        .setColor(0xcc0000)
        .setTitle("STOP RIGHT THERE!")
        .setDescription(
          "The post i was about to send is NSFW, luckily i've blocked it for your safety, if you are trying to get posts from NSFW subs, well, you can't!"
        )
        .setImage("attachment://arnoldSchwarzeneggerStopMeme.jpg");

      try {
        return await message.reply({ embeds: [embed], files: [imageFile] });
      } catch (error) {
        return;
      }
    }

    embed
      .setColor(0xffcc00)
      .setTitle(memeData.title)
      .setDescription("From **r/" + memeData.subreddit + "** | " + memeData.postLink)
      .setImage(memeData.url)
      .setFooter({ text: "⬆️ Upvotes " + memeData.ups });

    const btnNextMeme = new ButtonBuilder().setCustomId("btn-meme-btnNextMeme").setEmoji("🔄").setLabel("Next Meme").setStyle(ButtonStyle.Primary);
    const btnStop = new ButtonBuilder().setCustomId("btn-meme-btnStop").setEmoji("🛑").setLabel("Stop").setStyle(ButtonStyle.Danger);
    const btnRow = new ActionRowBuilder().addComponents(btnNextMeme, btnStop);

    var sentMessage;
    try {
      sentMessage = await message.reply({ embeds: [embed], components: [btnRow] });
    } catch (error) {
      return;
    }

    const btnCollector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30_000,
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
            btnCollector.stop();

            try {
              return await btnInteraction.update({ content: "Opsy, i couldn't get the meme, try typing the command again", components: [] });
            } catch (error) {
              return;
            }
          }

          if (memeData.nsfw) {
            imageFile.setFile("./media/arnoldSchwarzeneggerStopMeme.jpg");

            embed
              .setColor(0xcc0000)
              .setTitle("STOP RIGHT THERE!")
              .setDescription(
                "The post i was about to send is NSFW, luckily i've blocked it for your safety, if you are trying to get posts from NSFW subs, well, you can't!"
              )
              .setImage("attachment://arnoldSchwarzeneggerStopMeme.jpg")
              .setFooter(null); // so that it dosen't keep the 'Upvotes' footer

            btnCollector.stop();

            try {
              return await btnInteraction.update({ embeds: [embed], components: [], files: [imageFile] });
            } catch (error) {
              return;
            }
          }

          embed
            .setColor(0xffcc00)
            .setTitle(memeData.title)
            .setDescription("From **r/" + memeData.subreddit + "** | " + memeData.postLink)
            .setImage(memeData.url)
            .setFooter({ text: "⬆️ Upvotes " + memeData.ups });

          btnCollector.resetTimer();

          try {
            await btnInteraction.update({ embeds: [embed], components: [btnRow] });
          } catch (error) {
            return;
          }

          break;

        case "btn-meme-btnStop":
          btnNextMeme.setDisabled(true);
          btnStop.setDisabled(true);

          try {
            await btnInteraction.update({ embeds: [embed], components: [btnRow] });
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
        return await sentMessage.edit({ embeds: [embed], components: [btnRow] });
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
