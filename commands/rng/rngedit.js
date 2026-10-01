const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");
const configChecker = require("../../utils/configChecker.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet.js");
const dbJsonDataSet = require("../../utils/dbJsonDataSet.js");

module.exports = {
  name: "rngedit",
  aliases: ["rnge"],
  description: "Modify the properties of an item",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isRngEnabled = await configChecker(client, message, "rng_cmd");
    if (isRngEnabled === null) return;

    if (!isRngEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("RNG commands are off! Type **d!setup rng** to enable them");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need the permission `Administrator` to use this command");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    // for mental health issues, the user can simply put "-" to skip existing parameters
    const givenArgs = args.join(" ");
    const parts = givenArgs.split("|").map((part) => part.trim());

    if (parts.length < 2) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Nothing to change")
        .setDescription(
          "Nothing has changed, valid parameters **d!rngedit dropId | newDropName | newOptionalDesc | newDropChance | newType | newTypeArgs**\n*Tip: Use `-` to skip a parameter you want to keep the same!*",
        );
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (parts.length > 6) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Invalid Format")
        .setDescription("Too many parameters, correct usage **d!rngedit dropId | newDropName | newOptionalDesc | newDropChance | newType | newTypeArgs**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    let [id, name, desc, chanceStr, type, typeArg] = parts;

    let serverDrops = await dbJsonDataGet(client, message, "server_drops");
    if (!Array.isArray(serverDrops)) serverDrops = [];

    const dropIndex = serverDrops.findIndex((drop) => drop.id === parseInt(id));

    if (dropIndex === -1) {
      embed.setColor(0xff0000).setTitle("❌ Not found").setDescription(`Item with id **${id}** dosen't exist, check the list with **d!drops**`);
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const existingDrop = serverDrops[dropIndex];

    // if arg is missing or set to "-", keep the existing property
    const finalName = name && name !== "-" ? name : existingDrop.name;
    const finalDesc = desc && desc !== "-" ? desc : existingDrop.desc;
    const finalChanceStr = chanceStr && chanceStr !== "-" ? chanceStr : existingDrop.chance.toString();
    const finalType = type && type !== "-" ? type.toLowerCase() : existingDrop.type;

    const chance = parseFloat(finalChanceStr);

    if (isNaN(chance) || chance < 0.000001 || chance > 100) {
      embed.setColor(0xff0000).setTitle("❌ Invalid Chance").setDescription("The drop chance must be a valid number between **100** and **0.000001**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    // subtract the OLD chance of this specific item before adding the NEW chance to prevent double-counting
    const currentTotalChanceWithoutThisItem = serverDrops.reduce((acc, drop) => acc + drop.chance, 0) - existingDrop.chance;
    const calcTotalChance = currentTotalChanceWithoutThisItem + chance;

    if (calcTotalChance > 100) {
      const overflow = calcTotalChance - 100;
      const availableSpace = 100 - currentTotalChanceWithoutThisItem;

      embed
        .setColor(0xff0000)
        .setTitle("❌ Total Drop Chance Exceeded")
        .setDescription(
          `The combined drop chance of all server drops is **${Number(calcTotalChance.toFixed(8))}%** (Maximum is 100%).\nYou only have **${Number(availableSpace.toFixed(8))}%** available space left, remove or adjust existing items by **${Number(overflow.toFixed(8))}%** to fit this item`,
        );
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    let newDrop;

    switch (finalType) {
      case "item":
        newDrop = {
          id: existingDrop.id,
          type: "item",
          name: finalName,
          desc: finalDesc,
          chance: chance,
        };

        break;

      case "money":
        let amount = existingDrop.money; // if no money, use the previous value
        if (typeArg && typeArg !== "-") {
          amount = parseInt(typeArg);
        }

        if (isNaN(amount) || amount <= 0 || amount > 1000000000) {
          embed.setColor(0xff0000).setTitle("❌ Invalid Amount").setDescription("The amount of money must be a valid number between **1** and **1000000000**");
          return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        }

        newDrop = {
          id: existingDrop.id,
          type: "money",
          name: finalName,
          desc: finalDesc,
          chance: chance,
          money: amount,
        };

        break;

      case "role":
        let roleIdToUse = existingDrop.role_id; // same thing goes here
        if (typeArg && typeArg !== "-") {
          roleIdToUse = typeArg.startsWith("<@&") && typeArg.endsWith(">") ? typeArg.slice(3, -1) : typeArg;
        }

        let role = message.guild.roles.cache.find((role) => role.id === roleIdToUse);

        if (!role) {
          embed.setColor(0xff0000).setTitle("❌ Invalid Role").setDescription("Mention a valid server role or provide a valid role ID.");
          return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        }

        newDrop = {
          id: existingDrop.id,
          type: "role",
          name: finalName,
          desc: finalDesc,
          chance: chance,
          role_id: roleIdToUse,
        };

        break;

      default:
        embed.setColor(0xff0000).setTitle("❌ Invalid Type").setDescription(`The type **${finalType}** does not exist, choose between **item**, **money** and **role**`);
        return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    serverDrops[dropIndex] = newDrop;

    if ((await dbJsonDataSet(client, message, "server_drops", serverDrops)) === null) return;

    embed
      .setColor(0x00ff00)
      .setTitle("✅ Drop Updated")
      .setDescription(`Successfully updated **${finalName} (${existingDrop.id})**!`)
      .addFields(
        { name: "New Chance", value: `${chance}%`, inline: true },
        { name: "Type", value: finalType, inline: true },
        { name: "Pool Capacity", value: `${Number(calcTotalChance.toFixed(8))}% / 100%`, inline: false },
      );

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
