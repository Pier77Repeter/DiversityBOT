const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");
const manageUserMoney = require("../../utils/manageUserMoney");
const cooldownManager = require("../../utils/cooldownManager");
const mathRandomInt = require("../../utils/mathRandomInt");

module.exports = {
  name: "rob",
  description: "Rob the mentioned user",
  cooldown: 7200,
  async execute(client, message, args) {
    try {
      if (message.mentions.members.first() == null) return await message.reply("Mentioned the user you want to rob");
    } catch (error) {
      return;
    }

    const mentionedUser = message.mentions.members.first().user;
    const embed = new EmbedBuilder();

    // checking if the mentioned user has the right amount of money
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT money FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, mentionedUser.id], (err, row) => {
        if (err) reject();
        else resolve(row);
      });
    });

    if (!row || row.money < 1000) {
      embed
        .setColor(0x808080)
        .setTitle(mentionedUser.username + " dosen't have enough money")
        .setDescription("This user dosen't have the minimum of **1000$** in his wallet, can't be robbed");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const cooldown = await cooldownManager(client, message, "robCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ You can rob again **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const items = await dbJsonDataGet(client, message.author, message, "items");
    if (items == null) return;

    var robProbs = mathRandomInt(1, 2),
      money;

    if (items.itemId4) {
      robProbs = 1;

      items.itemId4 = false;
      if ((await dbJsonDataSet(client, message, "items", items)) == null) return;
    }

    if (robProbs != 1) {
      money = mathRandomInt(500, 700);

      if ((await manageUserMoney(client, message, "-", money)) == null) return;

      embed
        .setColor(0x33ccff)
        .setTitle("👮 You got caught stealing")
        .setDescription("You lost **" + money + "$** 🚓 🚓 🚓 🚓 🚓");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    // updating mentioned user's money
    money = mathRandomInt(300, 600);
    await new Promise((resolve, reject) => {
      client.database.run("UPDATE User SET money = ? WHERE serverId = ? AND userId = ?", [money, message.guild.id, mentionedUser.id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    embed
      .setColor(0x33ccff)
      .setTitle("🕵️‍♂️ Don't tell anyone!")
      .setDescription("You stole **" + money + "$** from " + mentionedUser.username);

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
