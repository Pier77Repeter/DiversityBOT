const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");

module.exports = {
  name: "bucket",
  aliases: ["buck"],
  description: "Check user bucket",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    // take a look into dbJsonDataGet AND dbJsonDataSet, it replys and returns null if shit goes wrong
    const fishes = await dbJsonDataGet(client, user, message, "fishes");
    if (fishes == null) return; // if error message is already sent, so just return

    const embed = new EmbedBuilder()
      .setColor(0x33ccff)
      .setTitle("🪣 " + user.username + "'s bucket:")
      .setDescription("You have no fishes here! Go fish something!");

    // have to remove this description if user has something ^
    for (const key in fishes) {
      if (key.startsWith("fishId") && !key.endsWith("Count")) {
        if (fishes[key] === true) {
          embed.setDescription(null);
          break;
        }
      }
    }

    if (fishes.fishId1) {
      embed.addFields({ name: "🐟 " + fishes.fishId1Count + " Classic fish", value: "Fish ID: **f1**" });
    }
    if (fishes.fishId2) {
      embed.addFields({ name: "🐠 " + fishes.fishId2Count + " Tropical fish", value: "Fish ID: **f2**" });
    }
    if (fishes.fishId3) {
      embed.addFields({ name: "🐡 " + fishes.fishId3Count + " Blowfish", value: "Fish ID: **f3**" });
    }
    if (fishes.fishId4) {
      embed.addFields({ name: "🦐 " + fishes.fishId4Count + " Shrimp", value: "Fish ID: **f4**" });
    }
    if (fishes.fishId5) {
      embed.addFields({ name: "🦞 " + fishes.fishId5Count + " Lobster", value: "Fish ID: **f5**" });
    }
    if (fishes.fishId6) {
      embed.addFields({ name: "🦀 " + fishes.fishId6Count + " Crab", value: "Fish ID: **f6**" });
    }
    if (fishes.fishId7) {
      embed.addFields({ name: "🦑 " + fishes.fishId7Count + " Squid", value: "Fish ID: **f7**" });
    }
    if (fishes.fishId8) {
      embed.addFields({ name: "🐙 " + fishes.fishId8Count + " Octopus", value: "Fish ID: **f8**" });
    }
    if (fishes.fishId9) {
      embed.addFields({ name: "🦈 " + fishes.fishId9Count + " Shark", value: "Fish ID: **f9**" });
    }
    if (fishes.fishId10) {
      embed.addFields({ name: "🐋 " + fishes.fishId10Count + " Whale", value: "Fish ID: **f10**" });
    }

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
