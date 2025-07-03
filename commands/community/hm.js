const { EmbedBuilder } = require("discord.js");
const serverCooldownManager = require("../../utils/serverCooldownManager");

module.exports = {
  name: "hm",
  aliases: ["hausemastermoment"],
  description: "Hausemaster moment",
  cooldown: 15,
  async execute(client, message, args) {
    const cooldown = await serverCooldownManager(client, message, "hmCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      const embed = new EmbedBuilder().setColor(0x000000).setDescription("⏰ Wait: **<t:" + cooldown[1] + ":R>** to make another Hausemaster moment");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    try {
      return await message.reply(
        [
          "Hausemaster moment:",
          "",
          "https://c.tenor.com/FmnXGH9h8V4AAAAd/tenor.gif",
          "",
          "https://c.tenor.com/tEItQ24H190AAAAd/tenor.gif",
          "",
          "https://www.youtube.com/shorts/XztSmGlxH-M",
          "",
          "https://youtu.be/GYLFiULboME",
          "",
          "https://youtu.be/FjcwH-Ikg_A",
          "",
          "https://youtu.be/4LAiC6AfAR0",
          "",
          "https://youtu.be/gT9HR1YwDPU",
          "",
          ":hause: :hausewithoutglasses: :trollmaster: :PrioQ: :priorityqueue: :hausemasterissue: :feels1tpsman: :coldhause: :hausecool:",
        ].join("\n")
      );
    } catch (error) {
      return;
    }
  },
};
