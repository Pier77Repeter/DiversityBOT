const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const serverCooldownManager = require("../../utils/serverCooldownManager");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "canny",
  description: "Play the Mr Incredible canny game",
  cooldown: 300,
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isCommunityEnabled = await configChecker(client, message, "community_cmd");
    if (isCommunityEnabled === null) return;

    if (!isCommunityEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Community commands are off! Type **d!setup community** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const cooldown = await serverCooldownManager(client, message, "canny_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed.setColor(0x000000).setDescription("⏰ You can play another canny game **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const imageFile = new AttachmentBuilder("./media/canny-1.jpg");

    embed.setColor(0xffcc66).setTitle("Say something canny (Stage 1/10) or say 'stop' to stop").setImage("attachment://canny-1.jpg");

    try {
      await message.reply({ embeds: [embed], files: [imageFile] });
    } catch {
      return;
    }

    // the collected message author MUST BE EQUAL to the command message author
    const filter = (collectedMessage) => collectedMessage.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter: filter, time: 30_000 });

    // this is needed to know at which phase are we
    let counter = 1;

    collector.on("collect", async (receivedMessage) => {
      counter++;

      if (receivedMessage.content.length > 256) {
        try {
          return await receivedMessage.reply({ content: "Message is too long, keep it under 2000 characters" });
        } catch {
          return;
        }
      }

      if (counter > 11 || receivedMessage.content.toLowerCase() == "stop") {
        return collector.stop();
      }

      imageFile.setFile(`./media/canny-${counter}.jpg`);
      embed
        .setTitle(receivedMessage.content)
        .setImage(`attachment://canny-${counter}.jpg`)
        .setFooter({ text: `Say something canny (Stage ${counter}/10) or say 'stop' to stop` });

      try {
        await receivedMessage.reply({ embeds: [embed], files: [imageFile] });
      } catch {
        return;
      }
    });

    collector.on("end", async () => {
      if (counter === 1) {
        try {
          return await message.reply("You didn't want to continue the game :(");
        } catch {
          return;
        }
      }
    });
  },
};
