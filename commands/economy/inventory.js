const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const msgErrorHandler = require("../../utils/msgErrorHandler");
const jsonDataAssociator = require("../../utils/jsonDataAssociator");

module.exports = {
  name: "inventory",
  aliases: ["inv"],
  description: "Check user inventory",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const items = await dbJsonDataGet(client, message, "items", user.id);
    if (items === null) return;

    const embed = new EmbedBuilder()
      .setColor(0x33ccff)
      .setTitle(`💼 ${user.username}'s Inventory`)
      .setDescription("There is no item to display here, go buy something from my store!");

    // have to remove this description if user has something
    items.forEach((item) => {
      if (item.quantity > 0) return embed.setDescription(null);
    });

    const botItems = jsonDataAssociator("items", items);

    botItems.forEach((item) => {
      if (item.quantity > 0) {
        embed.addFields({ name: `${item.displayName} (x${item.quantity})`, value: `Item ID: **${item.id++}**` });
      }
    });

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
