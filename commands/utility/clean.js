const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const delay = require("../../utils/delay");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "clean",
  aliases: ["clear"],
  description: "Clean x message from the channel",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, message, "mod_cmd");
    if (isModEnabled === null) return;

    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **d!setup mod** to enable them");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("You need the permission `Manage Messages` to use this command");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageMessages)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("I don't have the permission to `Manage Messages` in this channel");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    let amount = parseInt(args[0]);

    if (isNaN(amount)) {
      embed.setColor(0xff0000).setTitle("❌ Invalid Number").setDescription("You must provide a valid number of messages");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (amount < 1 || amount > 99) {
      embed.setColor(0xff0000).setTitle("❌ Out of Range").setDescription("You must provide a number **between 1 and 99**");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    amount++; // +1 for the command message itself

    const fetchedMessages = await message.channel.messages.fetch({ limit: amount });
    const messagesToProcess = fetchedMessages.toJSON().slice(0, amount);

    let deletedCount = 0;

    // in this chunk many things could go wrong while deleting the messages, dont wanna vomit the useless error, i trust this thing to delete the needed messages
    try {
      const deleted = await message.channel.bulkDelete(messagesToProcess, true);
      deletedCount = deleted.size;
    } catch (error) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Whoospy")
        .setDescription("An error occurred while trying to clean messages, messages older than 14 days cannot be deleted, try a smaller amount");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    embed.setColor(0x33ff33).setTitle("✅ Done").setDescription(`Successfully cleaned **${deletedCount}** messages from the channel`);

    await message.channel
      .send({ embeds: [embed] })
      .then(async (sentMessage) => {
        await delay(5000);
        await sentMessage.delete();
      })
      .catch(msgErrorHandler);

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🧹 Cleaned Messages")
      .setDescription(`Cleaned **${deletedCount}** messages from channel <#${message.channel.id}>`)
      .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    modActionLogger(client, message, embed);
  },
};
