const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");
const configChecker = require("../../utils/configChecker.js");

module.exports = {
  name: "rnginfo",
  aliases: ["rngi", "rnghelp"],
  description: "Describes in short how this system works",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isRngEnabled = await configChecker(client, message, "rng_cmd");
    if (isRngEnabled === null) return;

    if (!isRngEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("RNG commands are off! Type **d!setup rng** to enable them");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const desc = [
      "Each time a message is sent, there is a chance (aka **Global Drop Chance / GDC**) an item can be found and saved in the user's drop list.",
      "The server admins with `Administrator` permission can increase or decrease the GDC at their likings with **d!rngdc <chance>** *(Reccomended between 1% and 10%)*.",
      "",
      "The **Per-Message Chance (PMC)** for dropping an item every time a message is sent is calculated as:\n`PMC = Item Chance / GDC`\n",
      "The expected amount of messages to drop the item is calculated as:\n`Num of Msgs = 1 / (PMC / 100)`",
      "", // skip
      "**The RNG Meter** is an helpful tool to focus your luck on a specific item, gaining RNG Meter EXP will increase the item's drop chance with a maximum of **x3**",
      "When sending a message the RNG Meter progress will advance by **1 EXP** with a 3 seconds cooldown between each sent message to prevent spam / flooding, my commands will fill the meter 20% faster.",
      "",
      "For Admins, in case an item is removed from the server drops list, **it will be removed from every member who found it**. Better be careful about it!",
      "",
      "For the rests that is literally it, the commands are explained in **d!help**, if you want to disable / enable this syste, type **d!setup rng**",
    ].join("\n");

    embed.setColor(0xb924bb).setTitle("🎲 The RNG System").setDescription(desc);

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
