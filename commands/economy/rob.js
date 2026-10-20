const { EmbedBuilder } = require("discord.js");
const dbJsonDataGet = require("../../utils/dbJsonDataGet");
const dbJsonDataSet = require("../../utils/dbJsonDataSet");
const manageUserMoney = require("../../utils/manageUserMoney");
const cooldownManager = require("../../utils/cooldownManager");
const mathRandomInt = require("../../utils/mathRandomInt");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "rob",
  description: "Rob the mentioned user",
  cooldown: 7200,
  async execute(client, message, args) {
    if (!message.mentions.members.first()) return await message.reply("Mention the user who you would like to rob").catch(msgErrorHandler);

    const mentionedUser = message.mentions.members.first().user;
    const embed = new EmbedBuilder();

    // checking if the mentioned user has the right amount of money
    const row = await client.database.query("SELECT money FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, mentionedUser.id]);

    if (row.rowCount === 0) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Nope")
        .setDescription("You can't rob " + user.username + " because he never tried EVEN 1 of my commands! >:(");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    if (Number(row.rows[0].money) < 1000) {
      embed
        .setColor(0x808080)
        .setTitle(mentionedUser.username + " dosen't have enough money")
        .setDescription("This user dosen't have the minimum of **1000$** in his wallet, can't be robbed");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const cooldown = await cooldownManager(client, message, "rob_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed.setColor(0x000000).setDescription("⏰ You can rob again **<t:" + cooldown[1] + ":R>**");
      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    const items = await dbJsonDataGet(client, message, "items", message.author.id);
    if (items === null) return;

    let robProbs = mathRandomInt(1, 2),
      money;

    if (items[3].quantity > 0) {
      robProbs = 1;
      items[3].quantity = 0;

      if ((await dbJsonDataSet(client, message, "items", items, message.author.id)) === null) return;
    }

    if (robProbs != 1) {
      money = mathRandomInt(500, 700);

      if ((await manageUserMoney(client, message, "-", money)) === null) return;

      embed
        .setColor(0x33ccff)
        .setTitle("👮 You got caught stealing")
        .setDescription("You lost **" + money + "$** 🚓 🚓 🚓 🚓 🚓");

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }

    // updating mentioned user's money
    money = mathRandomInt(300, 600);
    await client.database.query("UPDATE users SET money = $1 WHERE server_id = $2 AND user_id = $3", [money, message.guildId, mentionedUser.id]);

    embed
      .setColor(0x33ccff)
      .setTitle("🕵️‍♂️ Don't tell anyone!")
      .setDescription("You stole **" + money + "$** from " + mentionedUser.username);

    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
