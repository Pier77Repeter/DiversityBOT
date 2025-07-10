const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const listsGetRandomItem = require("../../utils/listsGetRandomItem");

module.exports = {
  name: "troll",
  description: "Troll the mentioned user",
  async execute(client, message, args) {
    try {
      if (message.mentions.members.first() == null) return await message.reply(message.author.username + ", insert troll target");
    } catch (error) {
      return;
    }

    const trollImageName = listsGetRandomItem(
      [
        "troll-1.jpg",
        "troll-2.jpg",
        "troll-3.jpg",
        "troll-4.jpg",
        "troll-5.jpg",
        "troll-6.jpg",
        "troll-7.jpg",
        "troll-8.jpg",
        "troll-9.jpg",
        "troll-10.jpg",
        "troll-11.jpg",
        "troll-12.jpg",
        "troll-13.jpg",
        "troll-14.jpg",
        "troll-15.jpg",
        "troll-16.jpg",
        "troll-17.jpg",
        "troll-18.jpg",
        "troll-19.jpg",
        "troll-20.jpg",
        "troll-21.jpg",
        "troll-22.jpg",
        "troll-23.jpg",
        "troll-24.jpg",
        "troll-25.jpg",
        "troll-26.jpg",
        "troll-27.jpg",
      ],
      false
    );
    const imageFile = new AttachmentBuilder("./media/" + trollImageName);
    const embed = new EmbedBuilder()
      .setColor(0xc0c0c0)
      .setTitle(message.mentions.members.first().user.username + " HAS BEEN TROLLED")
      .setImage("attachment://" + trollImageName);

    try {
      return await message.reply({ embeds: [embed], files: [imageFile] });
    } catch (error) {
      return;
    }
  },
};
