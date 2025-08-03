const { EmbedBuilder } = require("discord.js");
const delay = require("../../utils/delay");
const mathRandomInt = require("../../utils/mathRandomInt");

module.exports = {
  name: "pp",
  description: "Check mentioned user pp's size",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user.username : message.author.username;

    const embed = new EmbedBuilder()
      .setColor(0x999999)
      .setTitle("🔍 Cheking user pp...")
      .setImage("https://media1.tenor.com/m/WS6B3HWtGC8AAAAd/cock-inspection.gif");

    var sentMessage;
    try {
      sentMessage = await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }

    await delay(3000);

    var embedDesc = "";

    for (let i = 0; i < mathRandomInt(1, 100); i++) {
      embedDesc += "=";
    }

    embed
      .setColor(0x33cc00)
      .setTitle(user + ", this is your peepee")
      .setFooter({ text: "This is for science" })
      .setImage();

    if (mathRandomInt(1, 10) == 1) {
      embed.setDescription("BD").setFooter({ text: "No pp here" });
    } else {
      embed.setDescription("B" + embedDesc + "D");
    }

    try {
      return await sentMessage.edit({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
