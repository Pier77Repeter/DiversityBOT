const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");
const configChecker = require("../../utils/configChecker.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet.js");
const dbJsonDataSet = require("../../utils/dbJsonDataSet.js");
const { normalizeDropName, isValidDropName } = require("../../utils/rngDropNameFixer.js");

module.exports = {
  name: "rngadd",
  aliases: ["rngadddrop", "rngad"],
  description: "Add a new item to the server's drops",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isRngEnabled = await configChecker(client, message, "rng_cmd");
    if (isRngEnabled === null) return;

    if (!isRngEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("RNG commands are off! Type **d!setup rng** to enable them");

      // hmmmm, this looks much better than an huge try-catch block, will use this from one
      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("You need the permission `Administrator` to use this command");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    // the commands works "d!rngadd dropName | optionalDesc | dropChance | type | extraArgs"
    const givenArgs = args.join(" ");
    const parts = givenArgs.split("|").map((part) => part.trim());

    if (parts.length < 3 || parts.length > 5) {
      embed.setColor(0xff0000).setTitle("❌ Invalid Format").setDescription("Correct usage **d!rngadd name | optionalDesc | chance | type | typeArgs**");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    /*
    So in order these are the parts (If user wants a custom description):
    parts[0] = name
    parts[1] = desc
    parts[2] = chance
    parts[3] = type
    parts[4] = typeArgs

    IF the user does NOT put any description:
    parts[0] = name
    parts[1] = chance
    parts[2] = type
    parts[3] = typeArgs
    */

    let name, desc, chanceStr, type, typeArg;

    name = normalizeDropName(parts[0]);

    // A numeric second field means the description was omitted.
    if (parts[1] !== undefined && !isNaN(parseFloat(parts[1]))) {
      desc = "This mystical item has no description :(";
      chanceStr = parts[1];
      type = parts[2];
      typeArg = parts[3] || null;
    } else {
      desc = parts[1] || "This mystical item has no description :(";
      chanceStr = parts[2];
      type = parts[3];
      typeArg = parts[4] || null;
    }

    if (!isValidDropName(name)) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Invalid Name")
        .setDescription('A drop name must include text; it can contain only one emoji, and it must be the first character, example "🪙 Golden Coin"');

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (name.length > 64 || desc.length > 256) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Name Or Desc too Long")
        .setDescription("An item name has a maximum length of **64** characters, while an item description can have maximum **256** characters");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const chance = parseFloat(chanceStr);

    if (isNaN(chance) || chance < 0.00001 || chance > 100) {
      embed.setColor(0xff0000).setTitle("❌ Invalid Chance").setDescription("The drop chance must be a valid number between **100** and **0.00001**");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    // these are needed for validating any duplicate names and for the global drop pool
    let serverDrops = await dbJsonDataGet(client, message, "server_drops");
    if (!Array.isArray(serverDrops)) serverDrops = [];

    // i do not want items with the same name
    const nameExists = serverDrops.some((drop) => normalizeDropName(drop.name) === normalizeDropName(name));

    if (nameExists) {
      embed.setColor(0xff0000).setTitle("❌ Duplicate Item").setDescription(`Item named **${name}** already exists in this server, use a different name`);

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    // we can NOT have the totalDropChance above 100%
    const currentTotalChance = serverDrops.reduce((acc, drop) => acc + drop.chance, 0);
    const calcTotalChance = currentTotalChance + chance;

    if (calcTotalChance > 100) {
      const overflow = calcTotalChance - 100;
      const availableSpace = 100 - currentTotalChance;

      embed
        .setColor(0xff0000)
        .setTitle("❌ Total Drop Chance Exceeded")
        .setDescription(
          `The combined drop chance of all server drops is **${Number(calcTotalChance.toFixed(8))}%** (Maximum is 100%).\n\nYou only have **${Number(availableSpace.toFixed(8))}%** available space left, remove or adjust existing items by **${Number(overflow.toFixed(8))}%** to fit this item`,
        );

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    // max 100 server drops
    if (serverDrops.length > 99) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Drops List is Full")
        .setDescription("This server has reached the maximum amount of possible drops configured, remove an existing drop with **d!rngdelete <itemId>** to add a new one");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    // i do not want a simple id increase system for items, so i re-use the available ones
    const existingIds = new Set(serverDrops.map((drop) => parseInt(drop.id)).filter((id) => !isNaN(id)));

    let newId = 1;

    while (existingIds.has(newId)) {
      newId++;
    }

    let newDrop = {};

    // IT IS PLANNED TO ALSO ADD XP, LATER THO
    switch (type) {
      case "item":
        newDrop = {
          id: newId.toString(),
          type: "item",
          name: name,
          desc: desc,
          chance: chance,
        };

        break;

      case "money":
        const amount = parseInt(typeArg);

        if (isNaN(amount) || amount <= 0 || amount > 1000000000) {
          embed.setColor(0xff0000).setTitle("❌ Invalid Amount").setDescription("The amount of money must be a valid number between **1** and **1000000000**");

          message.reply({ embeds: [embed] }).catch(msgErrorHandler);
          return;
        }

        newDrop = {
          id: newId.toString(),
          type: "money",
          name: name,
          desc: desc,
          chance: chance,
          money: amount,
        };

        break;

      case "role":
        let roleId = typeArg.startsWith("<@&") && typeArg.endsWith(">") ? typeArg.slice(3, -1) : null;
        let role = message.guild.roles.cache.find((role) => role.id === roleId);

        if (!role) {
          embed.setColor(0xff0000).setTitle("❌ Invalid Role").setDescription("Mention a valid server role with @");

          message.reply({ embeds: [embed] }).catch(msgErrorHandler);
          return;
        }

        newDrop = {
          id: newId.toString(),
          type: "role",
          name: name,
          desc: desc,
          chance: chance,
          role_id: role.id,
        };

        break;

      default:
        embed.setColor(0xff0000).setTitle("❌ Invalid Type").setDescription(`The type **${type}** does not exist, choose between **item**, **money** and **role**`);

        message.reply({ embeds: [embed] }).catch(msgErrorHandler);
        return;
    }

    serverDrops.push(newDrop);

    // sorting items by id back to cresecent order
    serverDrops.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    if ((await dbJsonDataSet(client, message, "server_drops", serverDrops)) === null) return;

    embed
      .setColor(0x00ff00)
      .setTitle("✅ Drop Added")
      .setDescription(`Successfully added **${name}** to the server's drop list!`)
      .addFields(
        { name: "ID", value: `${newId}`, inline: true },
        { name: "Chance", value: `${chance}%`, inline: true },
        { name: "Description", value: desc, inline: false },
        { name: "Pool Capacity", value: `${Number(calcTotalChance.toFixed(8))}% / 100%`, inline: false },
      );

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
