const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");
const mathRandomInt = require("../../utils/mathRandomInt");
const cooldownManager = require("../../utils/cooldownManager");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "fish",
  description: "Catch a fish",
  cooldown: 900,
  async execute(client, message, args) {
    const items = await dbJsonDataGet(client, message, "items", message.author.id);
    if (items === null) return;

    const embed = new EmbedBuilder();

    // json array starts from 0, so item 6 is index 5
    if (items[5].quantity === 0) {
      embed.setColor(0xff0000).setTitle("❌ Missing Item").setDescription("You need to buy a **fishing rod** for fishing");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const cooldown = await cooldownManager(client, message, "fish_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed.setColor(0x000000).setDescription("⏰ Next fishing session **<t:" + cooldown[1] + ":R>**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (mathRandomInt(1, 10) === 1) {
      items[5].quantity = 0;

      if ((await dbJsonDataSet(client, message, "items", items, message.author.id)) === null) return;

      embed.setColor(0xff0000).setTitle("😢 Oh No!").setDescription("Your fishing just broke, go buy a new one to fish again");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (mathRandomInt(1, 3) === 1) {
      embed.setColor(0xff0000).setTitle("🌊 Nothing, just water").setDescription("You haven't caught any fish, try again later");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const embedTexts = [
      { id: "1", title: "🐟 You caught a fish", desc: "Classic fish" },
      { id: "2", title: "🐠 You caught a tropical fish", desc: "Nice fish you got!" },
      { id: "3", title: "🐡 You caught a puffer fish", desc: "You just got a fat fish XD" },
      { id: "4", title: "🦐 You caught a shrimp", desc: "Not a fish but stil nice and tasty" },
      { id: "5", title: "🦞 You caught a lobster", desc: "Nice" },
      { id: "6", title: "🦀 You caught a crab", desc: "Let him dance in peace!" },
      { id: "7", title: "🦑 You caught a squid", desc: "A...squid..." },
      { id: "8", title: "🐙 You caught an octopus", desc: "Impressive" },
      { id: "9", title: "🦈 You caught a shark", desc: "JO BRO WTF" },
      { id: "10", title: "🐋 You caught a whale", desc: "Physics has left the game" },
    ];

    const caughtFish = embedTexts[mathRandomInt(0, embedTexts.length - 1)];

    const fishes = await dbJsonDataGet(client, message, "fishes", message.author.id);
    if (fishes === null) return;

    fishes[caughtFish.id].quantity++;

    if ((await dbJsonDataSet(client, message, "fishes", fishes, message.author.id)) === null) return;

    embed.setColor(0x33ff33).setTitle(caughtFish.title).setDescription(caughtFish.desc);

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
