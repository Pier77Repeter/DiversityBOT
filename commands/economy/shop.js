const { EmbedBuilder } = require("discord.js");
const { itemPrices } = require("../../config.json");

module.exports = {
  name: "shop",
  aliases: ["store"],
  description: "See the bot store",
  async execute(client, message, args) {
    const embed = new EmbedBuilder()
      .setColor(0x33ffff)
      .setTitle("🏪 Welcome to the DiversityShop!")
      .setDescription("You can buy Crypto, perks, and other things!")
      .addFields([
        {
          name: "💎 DiversityGem: 1000000$",
          value: "Very useful and overpower\nItem ID: **1**",
          inline: false,
        },
        {
          name: "🪙 Bitcoin: " + itemPrices.bitcoinPrice + "$",
          value: "Best Crypto currency\nItem ID: **2**",
          inline: false,
        },
        {
          name: "🪙 Dogecoin: " + itemPrices.dogecoinPrice + "$",
          value: "Elon Musk's crypto currency\nItem ID: **3**",
          inline: false,
        },
        {
          name: "🔫 Gun: 3000$",
          value: "Get 100% probs when rob someone\nItem ID: **4**",
          inline: false,
        },
        {
          name: "🔫 AK-47: 7000$",
          value: "Commit a crime with this\nItem ID: **5**",
          inline: false,
        },
        {
          name: "🎣 Fishing rod: 500$",
          value: "Use this to catch some fish\nItem ID: **6**",
          inline: false,
        },
        {
          name: "🍌 Banana: 200$",
          value: "Delicious food for Monkes\nItem ID: **7**",
          inline: false,
        },
        {
          name: "🥫 Beans: 400$",
          value: "This food is a weapon\nItem ID: **8**",
          inline: false,
        },
        {
          name: "💩 Holy poo: 1000$",
          value: "Trow the poo to people!\nItem ID: **9**",
          inline: false,
        },
        {
          name: "🗿 Moacoin: " + itemPrices.moacoinPrice + "$",
          value: "Better than Bitcoin\nItem ID: **10**",
          inline: false,
        },
        {
          name: "🪙 Divcoin: " + itemPrices.divcoinPrice + "$",
          value: "Not a normal crypto\nItem ID: **11**",
          inline: false,
        },
        {
          name: "🔫 Kar98k scoped: 5000$",
          value: "Use this to hunt in the wild\nItem ID: **12**",
          inline: false,
        },
        {
          name: "⛏️ Pickaxe: 700$",
          value: "Use this to mine\nItem ID: **13**",
          inline: false,
        },
      ]);

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
