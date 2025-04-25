const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");

module.exports = {
  name: "inventory",
  aliases: ["inv"],
  description: "Check user inventory",
  async execute(client, message, args) {
    // THIS IS PERFECT, USE THIS WHEN CHECKING IF MENTIONED USER OR MESSAGE AUTHOR
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const items = await dbJsonDataGet(client, user, message, "items");
    if (items == null) return; // message is already sent, so just return

    const embed = new EmbedBuilder()
      .setColor(0x33ccff)
      .setTitle("💼 " + user.username + "'s inventory:")
      .setDescription("You have nothing, go buy something in the store!");

    // have to remove this description if user has something ^
    for (const key in items) {
      if (key.startsWith("itemId") && !key.endsWith("Count")) {
        if (items[key] === true) {
          embed.setDescription(null);
          break;
        }
      }
    }

    if (items.itemId1) {
      embed.addFields({ name: "💎 DiversityGem", value: "Item ID: **1**" });
    }
    if (items.itemId2) {
      embed.addFields({ name: "🪙 " + items.itemId2Count + " Bitcoin", value: "Item ID: **2**" });
    }
    if (items.itemId3) {
      embed.addFields({ name: "🪙 " + items.itemId3Count + " Dogecoin", value: "Item ID: **3**" });
    }
    if (items.itemId4) {
      embed.addFields({ name: "🔫 Gun", value: "Item ID: **4**" });
    }
    if (items.itemId5) {
      embed.addFields({ name: "🔫 AK-47", value: "Item ID: **5**" });
    }
    if (items.itemId6) {
      embed.addFields({ name: "🎣 Fishing rod", value: "Item ID: **6**" });
    }
    if (items.itemId7) {
      embed.addFields({ name: "🍌 Banana", value: "Item ID: **7**" });
    }
    if (items.itemId8) {
      embed.addFields({ name: "🥫 Beans", value: "Item ID: **8**" });
    }
    if (items.itemId9) {
      embed.addFields({ name: "💩 Holy poo", value: "Item ID: **9**" });
    }
    if (items.itemId10) {
      embed.addFields({ name: "🗿 " + items.itemId10Count + " Moacoin", value: "Item ID: **10**" });
    }
    if (items.itemId11) {
      embed.addFields({ name: "🪙 " + items.itemId11Count + " Divcoin", value: "Item ID: **11**" });
    }
    if (items.itemId12) {
      embed.addFields({ name: "🔫 Kar98k scoped", value: "Item ID: **12**" });
    }
    if (items.itemId13) {
      embed.addFields({ name: "⛏️ Pickaxe", value: "Item ID: **13**" });
    }

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
