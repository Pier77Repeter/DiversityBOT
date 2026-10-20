const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const manageUserMoney = require("../../utils/manageUserMoney");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");
const msgErrorHandler = require("../../utils/msgErrorHandler");
const jsonDataAssociator = require("../../utils/jsonDataAssociator");

module.exports = {
  name: "buy",
  description: "Buy an item from the store",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    if (!args[0]) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Wrong syntax, choose the item you want to buy **d!buy <itemName>**");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const items = await dbJsonDataGet(client, message, "items", message.author.id);
    if (items === null) return;

    const row = await client.database.query("SELECT money FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, message.author.id]);

    // this shouldn't happen since data is created before command gets executed, still wise to have this
    if (row.rowCount === 0) {
      throw new Error(
        ["The record 'money' was NOT found in the database, CHECK THE QUERY", `Requested from Server: '${message.guildId}' - User: '${message.author.id}'`].join("\n"),
      );
    }

    const itemToBuy = args.join(" ").toLowerCase();
    // jsonDataAssociator() simply adds the quantity to a pre-defined array of bot items
    const botItems = jsonDataAssociator("items", items);

    let foundItem = false;

    botItems.forEach(async (item) => {
      if (item.id === itemToBuy || item.name.toLowerCase() === itemToBuy) {
        foundItem = true;
        // WHY ID - 1??? because i say so, item ids starts from 1 but json array index starts from 0
        return await buyItem(item.id - 1, item.displayName, item.price, item.isSingleItem);
      }
    });

    // well we haven't found any item
    if (!foundItem) {
      embed.setColor(0xff0000).setTitle("❌ Not Found").setDescription("That item does not exist in my store, check with **d!shop**");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    async function buyItem(itemId, itemName, itemCost, isSingleItem) {
      if (items[itemId].quantity > 0 && isSingleItem) {
        embed.setColor(0xff0000).setTitle("❌ Already Bought").setDescription("You already own this item, check with **d!inv**");

        return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      }

      if (row.rows[0].money < itemCost) {
        const missingMoney = (Number(row.rows[0].money) - parseInt(itemCost)) * -1; // remove the -

        embed.setColor(0xff0000).setTitle("❌ Missing Money").setDescription(`You need **${missingMoney}$** to buy that item`);

        return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      }

      items[itemId].quantity = isSingleItem ? 1 : items[itemId].quantity + 1;

      if ((await dbJsonDataSet(client, message, "items", items, message.author.id)) === null) return;
      if ((await manageUserMoney(client, message, "-", itemCost)) === null) return;

      embed.setColor(0x00ff00).setTitle("✅ Purchase Successful").setDescription(`You bought a **${itemName}** for **${itemCost}$**`);

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }
  },
};
