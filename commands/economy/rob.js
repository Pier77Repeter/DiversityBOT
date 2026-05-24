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
      if (!message.mentions.members.first()) return await message.reply("Mentioned the user you want to rob");
    } catch {
      return;
    }

    const mentionedUser = message.mentions.members.first().user;
    const embed = new EmbedBuilder();

    // checking if the mentioned user has the right amount of money
    const row = await client.database.query("SELECT money FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, mentionedUser.id]);

    if (row.rowCount === 0) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("You can't rob " + user.username + " because he never tried EVEN 1 of my commands! >:(");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (Number(row.rows[0].money) < 1000) {
      embed
        .setColor(0x808080)
        .setTitle(mentionedUser.username + " dosen't have enough money")
        .setDescription("This user dosen't have the minimum of **1000$** in his wallet, can't be robbed");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const cooldown = await cooldownManager(client, message, "rob_cooldown", this.cooldown);
    if (cooldown === null) return;

    if (cooldown) {
      embed.setColor(0x000000).setDescription("⏰ You can rob again **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const items = await dbJsonDataGet(client, message.author, message, "items");
    if (items === null) return;

    let robProbs = mathRandomInt(1, 2),
      money;

    if (items.itemId4) {
      robProbs = 1;

      items.itemId4 = false;
      if ((await dbJsonDataSet(client, message, "items", items)) === null) return;
    }

    if (robProbs != 1) {
      money = mathRandomInt(500, 700);

      if ((await manageUserMoney(client, message, "-", money)) === null) return;

      embed
        .setColor(0x33ccff)
        .setTitle("👮 You got caught stealing")
        .setDescription("You lost **" + money + "$** 🚓 🚓 🚓 🚓 🚓");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    // updating mentioned user's money
    money = mathRandomInt(300, 600);
    await client.database.query("UPDATE users SET money = $1 WHERE server_id = $2 AND user_id = $3", [money, message.guildId, mentionedUser.id]);

    embed
      .setColor(0x33ccff)
      .setTitle("🕵️‍♂️ Don't tell anyone!")
      .setDescription("You stole **" + money + "$** from " + mentionedUser.username);

    try {
      return await message.reply({ embeds: [embed] });
    } catch {
      return;
    }
  },
};
