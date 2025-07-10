const { EmbedBuilder } = require("discord.js");
const delay = require("../../utils/delay");
const listsGetRandomItem = require("../../utils/listsGetRandomItem");

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

    embed
      .setColor(0x33cc00)
      .setTitle(user + ", this is your peepee")
      .setDescription(
        listsGetRandomItem(
          [
            "BD",
            "B=D",
            "B==D",
            "B====D",
            "B======D",
            "B========D",
            "B==========D",
            "B============D",
            "B==============D",
            "B================D",
            "B==================D",
            "B====================D",
            "B======================D",
            "B========================D",
            "B==========================D",
            "B============================D",
            "B==============================D",
            "B================================D",
            "B==================================D",
            "B====================================D",
            "B======================================D",
            "B========================================D",
            "B==========================================D",
            "B============================================D",
            "B==============================================D",
            "B================================================D",
            "B==================================================D",
            "B====================================================D",
            "B======================================================D",
            "B========================================================================================================================================================================================================D",
          ],
          false
        )
      )
      .setFooter({ text: "This is for science" })
      .setImage();

    try {
      return await sentMessage.edit({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
