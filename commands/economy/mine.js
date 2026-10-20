const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");
const mathRandomInt = require("../../utils/mathRandomInt");
const cooldownManager = require("../../utils/cooldownManager");
const manageUserMoney = require("../../utils/manageUserMoney");
const delay = require("../../utils/delay");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "mine",
  description: "Mine some ores",
  cooldown: 3600,
  async execute(client, message, args) {
    const items = await dbJsonDataGet(client, message, "items", message.author.id);
    if (items === null) return;

    const embed = new EmbedBuilder();

    if (items[12].quantity === 0) {
      embed.setColor(0xff0000).setTitle("❌ Missing Item").setDescription("You need to buy a **pickaxe** for mining ores");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const cooldown = await cooldownManager(client, message, "mine_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed.setColor(0x000000).setDescription(`⏰ Mine is closed, will re-open **<t:${cooldown[1]}:R>**`);

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (mathRandomInt(1, 8) === 1) {
      items[12].quantity = 0;

      if ((await dbJsonDataSet(client, message, "items", items, message.author.id)) === null) return;

      embed.setColor(0xff0000).setTitle("👷‍♂️💥⬛").setDescription("Your pickaxe exploded! Go buy a new one to mine again");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    embed.setColor(0x666666).setTitle("👷‍♂️⛏️⬛⬛⬛⬛⬛⬛⬛⬛⬛").setDescription("You started mining, let's hope you find some ores").setFooter({ text: "Minecraft bottom text" });

    const sentMessage = await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    if (!sentMessage) return;

    await delay(1000);

    embed.setColor(0x666666).setTitle("👷‍♂️⛏️⬛⬛⬛⬛⬛⬛⬛⬛").setDescription("You started mining, let's hope you find some ores").setFooter({ text: "Minecraft bottom text" });

    try {
      await sentMessage.edit({ embeds: [embed] });
    } catch (error) {
      return msgErrorHandler(error);
    }

    await delay(1000);

    embed.setColor(0x666666).setTitle("👷‍♂️⛏️⬛⬛⬛⬛⬛⬛⬛").setDescription("You started mining, let's hope you find some ores").setFooter({ text: "Minecraft bottom text" });

    try {
      await sentMessage.edit({ embeds: [embed] });
    } catch (error) {
      return msgErrorHandler(error);
    }

    await delay(1000);

    embed.setColor(0x666666).setTitle("👷‍♂️⛏️⬛⬛⬛⬛⬛⬛").setDescription("You started mining, let's hope you find some ores").setFooter({ text: "Minecraft bottom text" });

    try {
      await sentMessage.edit({ embeds: [embed] });
    } catch (error) {
      return msgErrorHandler(error);
    }

    await delay(1000);

    embed.setColor(0x666666).setTitle("👷‍♂️⛏️⬛⬛⬛⬛⬛").setDescription("You started mining, let's hope you find some ores").setFooter({ text: "Minecraft bottom text" });

    try {
      await sentMessage.edit({ embeds: [embed] });
    } catch (error) {
      return msgErrorHandler(error);
    }

    await delay(1000);

    embed.setColor(0x666666).setTitle("👷‍♂️⛏️⬛⬛⬛⬛").setDescription("You started mining, let's hope you find some ores").setFooter({ text: "Minecraft bottom text" });

    try {
      await sentMessage.edit({ embeds: [embed] });
    } catch (error) {
      return msgErrorHandler(error);
    }

    await delay(1000);

    embed.setColor(0x666666).setTitle("👷‍♂️⛏️⬛⬛⬛").setDescription("You started mining, let's hope you find some ores").setFooter({ text: "Minecraft bottom text" });

    try {
      await sentMessage.edit({ embeds: [embed] });
    } catch (error) {
      return msgErrorHandler(error);
    }

    await delay(1000);

    embed.setColor(0x666666).setTitle("👷‍♂️⛏️⬛⬛").setDescription("You started mining, let's hope you find some ores").setFooter({ text: "Minecraft bottom text" });

    try {
      await sentMessage.edit({ embeds: [embed] });
    } catch (error) {
      return msgErrorHandler(error);
    }

    await delay(1000);

    if (mathRandomInt(1, 4) === 1) {
      embed.setColor(0xff0000).setTitle("👷‍♂️⛏️⬛").setDescription("You found nothing").setFooter({ text: "Just rocks" });

      return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);
    }

    // this was needed for the description
    const oresMoney = [mathRandomInt(150, 300), mathRandomInt(30, 70), mathRandomInt(100, 250), mathRandomInt(10, 50), mathRandomInt(200, 300), mathRandomInt(100, 200)];

    const embedTexts = [
      {
        title: "👷‍♂️⛏️💎",
        desc: `You found a rare gem, you got **${oresMoney[0]}$**`,
        footer: "Awesome find!",
        price: oresMoney[0],
      },
      {
        title: "👷‍♂️⛏️☠️",
        desc: `You found a skuuuuuull, you got **${oresMoney[1]}$**`,
        footer: "scary",
        price: oresMoney[1],
      },
      {
        title: "👷‍♂️⛏️🟨",
        desc: `You found shiny gold, you got **${oresMoney[2]}$**`,
        footer: "Stonks",
        price: oresMoney[2],
      },
      {
        title: "👷‍♂️⛏️♦️",
        desc: `You found redstone, you got **${oresMoney[3]}$**`,
        footer: "Mumbo Jumbo reference",
        price: oresMoney[3],
      },
      {
        title: "👷‍♂️⛏️🔷",
        desc: `You found a diamond, you got **${oresMoney[4]}$**`,
        footer: "Craft a diamond armor now",
        price: oresMoney[4],
      },
      {
        title: "👷‍♂️⛏️🛢️",
        desc: `You found OIL, you got **${oresMoney[5]}$**`,
        footer: "USA is coming for you!",
        price: oresMoney[5],
      },
    ];

    const foundOre = embedTexts[mathRandomInt(0, embedTexts.length - 1)];

    if ((await manageUserMoney(client, message, "+", foundOre.price)) === null) return;

    embed.setColor(0x33ff33).setTitle(foundOre.title).setDescription(foundOre.desc).setFooter({ text: foundOre.footer });

    return await sentMessage.edit({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
