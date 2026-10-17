const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "bucket",
  aliases: ["buck"],
  description: "Check user bucket",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    // take a look into dbJsonDataGet AND dbJsonDataSet, it replys and returns null if shit goes wrong
    const fishes = await dbJsonDataGet(client, message, "fishes", user.id);
    if (fishes === null) return; // if error message is already sent, so just return

    const embed = new EmbedBuilder()
      .setColor(0x33ccff)
      .setTitle("🪣 " + user.username + "'s Bucket")
      .setDescription("No fishes to display here, start fishing with **d!fish**");

    // have to remove this description if user has something ^
    fishes.forEach((fish) => {
      if (fish.quantity > 0) return embed.setDescription(null);
    });

    const botItems = jsonDataAssociator("items", items);

    botItems.forEach((fish) => {
      if (fish.quantity > 0) {
        embed.addFields({ name: `${fish.displayName} (x${fish.quantity})`, value: `Fish ID: **${fish.id++}**` });
      }
    });

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
