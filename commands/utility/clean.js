const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const delay = require("../../utils/delay");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");

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

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need the permission `Manage messages` to use this command");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageMessages)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("I don't have the permission to `Manage messages` in this channel");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    var amount = parseInt(args[0]);

    if (isNaN(amount)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You must provide a valid number of messages");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (amount < 1 || amount > 99) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You must provide a number **between 1 and 99**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    amount = amount + 1; // for the command message itself
    const fetchedMessages = await message.channel.messages.fetch({ limit: amount });

    const messagesToProcess = fetchedMessages.toJSON().slice(0, amount);

    var deletedCount = 0;

    // in this chunk many things could go wrong while deleting the messages, dont wanna vomit the useless error, i trust this thing to delete the needed messages
    try {
      const deleted = await message.channel.bulkDelete(messagesToProcess, true);
      deletedCount = deleted.size;
    } catch {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("An error occurred while trying to clean messages, messages older than 14 days cannot be deleted, try a smaller amount");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    embed.setColor(0x33ff33).setTitle("✅ Done").setDescription(`Successfully cleaned **${deletedCount}** messages from the channel`);

    try {
      await message.channel.send({ embeds: [embed] }).then(async (sentMessage) => {
        await delay(5000);
        await sentMessage.delete();
      });
    } catch {
      // continue, no need to stop
    }

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🧹 Cleaned Messages")
      .setDescription("Cleaned **" + deletedCount + "** messages from channel <#" + message.channel.id + ">")
      .setFooter({ text: "Action by " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await modActionLogger(client, message, embed);
  },
};
