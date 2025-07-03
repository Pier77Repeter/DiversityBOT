const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const serverCooldownManager = require("../../utils/serverCooldownManager");
const delay = require("../../utils/delay");
const listsGetRandomItem = require("../../utils/listsGetRandomItem");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "jm",
  aliases: ["javamoment"],
  description: "Java moment",
  cooldown: 30,
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isCommunityEnabled = await configChecker(client, message, "communityCmd");
    if (isCommunityEnabled == null) return;

    if (isCommunityEnabled == 0) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Community commands are off! Type **d!setup community** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const cooldown = await serverCooldownManager(client, message, "jmCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ Wait: **<t:" + cooldown[1] + ":R>** to make another Java moment");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const imageFile = new AttachmentBuilder("./media/javaMascot.png");

    try {
      await message.reply({ files: [imageFile] });
    } catch (error) {
      return;
    }

    await delay(2000);

    imageFile.setFile("./media/javaLogo.png");
    try {
      await message.channel.send({ files: [imageFile] });
    } catch (error) {
      return;
    }

    await delay(2000);

    imageFile.setFile("./media/javaLogo2.png");
    try {
      await message.channel.send({ files: [imageFile] });
    } catch (error) {
      return;
    }

    await delay(1000);

    try {
      await message.channel.send("Java moment!");
    } catch (error) {
      return;
    }

    await delay(3000);

    try {
      await message.channel.send("https://c.tenor.com/PZSmpxGQHfoAAAAd/tenor.gif");
    } catch (error) {
      return;
    }

    await delay(3000);

    try {
      await message.channel.send(
        listsGetRandomItem(
          [
            "https://c.tenor.com/LBckms9JUpoAAAAd/tenor.gif",
            "https://c.tenor.com/N_b6y7Ym0b0AAAAd/tenor.gif",
            "https://c.tenor.com/BkCHX6EdcMwAAAAd/tenor.gif",
            "https://c.tenor.com/beoMANVJLvwAAAAd/tenor.gif",
            "https://c.tenor.com/fMUOPRVdSzUAAAAd/tenor.gif",
            "https://c.tenor.com/DxeK02KwNbEAAAAd/tenor.gif",
            "https://c.tenor.com/2o2btC2kLXoAAAAd/tenor.gif",
            "https://c.tenor.com/rh87gPA5SfUAAAAd/tenor.gif",
          ],
          false
        )
      );
    } catch (error) {
      return;
    }
  },
};
