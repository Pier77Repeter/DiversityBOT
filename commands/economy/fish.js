const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");
const mathRandomInt = require("../../utils/mathRandomInt");
const cooldownManager = require("../../utils/cooldownManager");

module.exports = {
  name: "fish",
  description: "Catch a fish",
  cooldown: 900,
  async execute(client, message, args) {
    const items = await dbJsonDataGet(client, message.author, message, "items");
    if (items == null) return;

    const embed = new EmbedBuilder();

    if (!items.itemId6) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need to buy a **fishing rod** for fishing");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const cooldown = await cooldownManager(client, message, "fishCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ Next fishing session in: **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (mathRandomInt(1, 4) == 1) {
      items.itemId6 = false;

      if ((await dbJsonDataSet(client, message, "items", items)) == null) return;

      embed
        .setColor(0xff0000)
        .setTitle("😢 Oh no")
        .setDescription("Your fishing rod broken, go buy a new one to start fishing again");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (mathRandomInt(1, 3) == 1) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You haven't caught any fish, try again later");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const embedTexts = [
      { id: "fishId1", counter: "fishId1Count", title: "🐟 You caught a fish", desc: "Classic fish" },
      { id: "fishId2", counter: "fishId2Count", title: "🐠 You caught a tropical fish", desc: "Nice fish you got!" },
      { id: "fishId3", counter: "fishId3Count", title: "🐡 You caught a puffer fish", desc: "You just got a fat fish XD" },
      { id: "fishId4", counter: "fishId4Count", title: "🦐 You caught a shrimp", desc: "Not a fish but stil nice and tasty" },
      { id: "fishId5", counter: "fishId5Count", title: "🦞 You caught a lobster", desc: "Nice" },
      { id: "fishId6", counter: "fishId6Count", title: "🦀 You caught a crab", desc: "Let him dance in peace!" },
      { id: "fishId7", counter: "fishId7Count", title: "🦑 You caught a squid", desc: "A...squid..." },
      { id: "fishId8", counter: "fishId8Count", title: "🐙 You caught an octopus", desc: "Impressive" },
      { id: "fishId9", counter: "fishId9Count", title: "🦈 You caught a shark", desc: "JO BRO WTF" },
      { id: "fishId10", counter: "fishId10Count", title: "🐋 You caught a whale", desc: "Physics has left the game" },
    ];

    const caughtFish = embedTexts[mathRandomInt(0, embedTexts.length - 1)];

    const fishes = await dbJsonDataGet(client, message.author, message, "fishes");
    if (fishes == null) return;

    fishes[caughtFish.id] = true;
    fishes[caughtFish.counter]++;

    if ((await dbJsonDataSet(client, message, "fishes", fishes)) == null) return;

    embed.setColor(0x33ff33).setTitle(caughtFish.title).setDescription(caughtFish.desc);

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
