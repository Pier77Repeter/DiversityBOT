const { EmbedBuilder } = require("discord.js");
const mathRandomInt = require("../../utils/mathRandomInt");

module.exports = {
  name: "ship",
  description: "See the love power with mentioned user",
  async execute(client, message, args) {
    try {
      if (message.mentions.members.first() == null) return await message.reply(message.author.username + ", mention your crush <3");
    } catch (error) {
      return;
    }

    const embed = new EmbedBuilder();

    const lovePower = mathRandomInt(0, 101);

    if (lovePower == 0) {
      embed
        .setColor(0xcc33cc)
        .setTitle("💘 Love machine 9000(TM)")
        .setDescription("Love power: **" + lovePower + "%** ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛")
        .setFields({ name: "😭", value: "You have no heart!" })
        .setImage(message.mentions.members.first().displayAvatarURL());
    }

    if (lovePower > 0 && lovePower < 11) {
      embed
        .setColor(0xcc33cc)
        .setTitle("💘 Love machine 9000(TM)")
        .setDescription("Love power: **" + lovePower + "%** 🟪⬛⬛⬛⬛⬛⬛⬛⬛⬛")
        .setFields({ name: "😥", value: "That's bad man" })
        .setImage(message.mentions.members.first().displayAvatarURL());
    }

    if (lovePower > 10 && lovePower < 21) {
      embed
        .setColor(0xcc33cc)
        .setTitle("💘 Love machine 9000(TM)")
        .setDescription("Love power: **" + lovePower + "%** 🟪🟪⬛⬛⬛⬛⬛⬛⬛⬛")
        .setFields({ name: "😦", value: "Pretty low" })
        .setImage(message.mentions.members.first().displayAvatarURL());
    }

    if (lovePower > 20 && lovePower < 31) {
      embed
        .setColor(0xcc33cc)
        .setTitle("💘 Love machine 9000(TM)")
        .setDescription("Love power: **" + lovePower + "%** 🟪🟪🟪⬛⬛⬛⬛⬛⬛⬛")
        .setFields({ name: "😕", value: "Not too great" })
        .setImage(message.mentions.members.first().displayAvatarURL());
    }

    if (lovePower > 30 && lovePower < 41) {
      embed
        .setColor(0xcc33cc)
        .setTitle("💘 Love machine 9000(TM)")
        .setDescription("Love power: **" + lovePower + "%** 🟪🟪🟪🟪⬛⬛⬛⬛⬛⬛")
        .setFields({ name: "😕", value: "Nah" })
        .setImage(message.mentions.members.first().displayAvatarURL());
    }

    if (lovePower > 40 && lovePower < 51) {
      embed
        .setColor(0xcc33cc)
        .setTitle("💘 Love machine 9000(TM)")
        .setDescription("Love power: **" + lovePower + "%** 🟪🟪🟪🟪🟪⬛⬛⬛⬛⬛")
        .setFields({ name: "😶", value: "Barely" })
        .setImage(message.mentions.members.first().displayAvatarURL());
    }

    if (lovePower > 50 && lovePower < 61) {
      embed
        .setColor(0xcc33cc)
        .setTitle("💘 Love machine 9000(TM)")
        .setDescription("Love power: **" + lovePower + "%** 🟪🟪🟪🟪🟪🟪⬛⬛⬛⬛")
        .setFields({ name: "🙂", value: "Not bad" })
        .setImage(message.mentions.members.first().displayAvatarURL());
    }

    if (lovePower > 60 && lovePower < 71) {
      embed
        .setColor(0xcc33cc)
        .setTitle("💘 Love machine 9000(TM)")
        .setDescription("Love power: **" + lovePower + "%** 🟪🟪🟪🟪🟪🟪🟪⬛⬛⬛")
        .setFields({ name: "😃", value: "Pretty good" })
        .setImage(message.mentions.members.first().displayAvatarURL());
    }

    if (lovePower > 70 && lovePower < 81) {
      embed
        .setColor(0xcc33cc)
        .setTitle("💘 Love machine 9000(TM)")
        .setDescription("Love power: **" + lovePower + "%** 🟪🟪🟪🟪🟪🟪🟪🟪⬛⬛")
        .setFields({ name: "😘", value: "Really impressive" })
        .setImage(message.mentions.members.first().displayAvatarURL());
    }

    if (lovePower > 80 && lovePower < 91) {
      embed
        .setColor(0xcc33cc)
        .setTitle("💘 Love machine 9000(TM)")
        .setDescription("Love power: **" + lovePower + "%** 🟪🟪🟪🟪🟪🟪🟪🟪🟪⬛")
        .setFields({ name: "🥰", value: "Amazing!" })
        .setImage(message.mentions.members.first().displayAvatarURL());
    }

    if (lovePower > 90 && lovePower < 101) {
      embed
        .setColor(0xcc33cc)
        .setTitle("💘 Love machine 9000(TM)")
        .setDescription("Love power: **" + lovePower + "%** 🟪🟪🟪🟪🟪🟪🟪🟪🟪🟪")
        .setFields({ name: "😍😍😍", value: "PERFECT!" })
        .setImage(message.mentions.members.first().displayAvatarURL());
    }

    if (lovePower == 101) {
      embed
        .setColor(0xffff00)
        .setTitle("❤️‍🔥 Love machine 9000(TM)")
        .setDescription("Love power: **ERROR** 🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨")
        .setFields({ name: "🤩🤩🤩", value: "TIME FOR SEX BABYYYY!" })
        .setImage(message.mentions.members.first().displayAvatarURL());
    }

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
