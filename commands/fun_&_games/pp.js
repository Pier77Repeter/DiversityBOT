const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const delay = require("../../utils/delay");
const listsGetRandomItem = require("../../utils/listsGetRandomItem");

// for this command TURN OFF 'Format on save' option in VSC
module.exports = {
  name: "pp",
  description: "Check mentioned user pp's size",
  async execute(client, message, args) {
    var userToCheck;
    try {
      userToCheck = message.mentions.members.first().user.username;
    } catch (error) {
      userToCheck = message.author.username;
    }

    const ppMessageEmbed = new EmbedBuilder()
      .setColor(0x999999)
      .setTitle("🔍 Cheking user pp...")
      .setImage("https://media1.tenor.com/m/WS6B3HWtGC8AAAAd/cock-inspection.gif");

    try {
      await message.reply({ embeds: [ppMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(3000);

    ppMessageEmbed
      .setColor(0x33cc00)
      .setTitle(userToCheck + ", this is your peepee")
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
            "B========================================================================================================================================================================================================D",
          ],
          false
        )
      )
      .setFooter({ text: "This is for science" })
      .setImage();

    try {
      return await message.reply({ embeds: [ppMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
