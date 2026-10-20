const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const serverCooldownManager = require("../../utils/serverCooldownManager");
const delay = require("../../utils/delay");
const listsGetRandomItem = require("../../utils/listsGetRandomItem");
const configChecker = require("../../utils/configChecker");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "jm",
  aliases: ["javamoment"],
  description: "Java moment",
  cooldown: 30,
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isCommunityEnabled = await configChecker(client, message, "community_cmd");
    if (isCommunityEnabled === null) return;

    if (!isCommunityEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Community commands are off! Type **d!setup community** to enable them");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const cooldown = await serverCooldownManager(client, message, "jm_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed.setColor(0x000000).setDescription(`⏰ You can do another Java moment **<t:${cooldown[1]}:R>**`);
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const imageFile = new AttachmentBuilder("./media/javaMascot.png");

    await message.reply({ files: [imageFile] }).catch(msgErrorHandler);

    await delay(2000);

    imageFile.setFile("./media/javaLogo.png");

    await message.channel.send({ files: [imageFile] }).catch(msgErrorHandler);

    await delay(2000);

    imageFile.setFile("./media/javaLogo2.png");

    await message.channel.send({ files: [imageFile] }).catch(msgErrorHandler);

    await delay(1000);

    await message.channel.send("Java moment!").catch(msgErrorHandler);

    await delay(3000);

    await message.channel.send("https://c.tenor.com/PZSmpxGQHfoAAAAd/tenor.gif").catch(msgErrorHandler);

    await delay(3000);

    return await message.channel
      .send(
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
          false,
        ),
      )
      .catch(msgErrorHandler);
  },
};
