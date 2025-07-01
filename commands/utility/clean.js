const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const delay = require("../../utils/delay");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "clean",
  aliases: ["clear"],
  description: "Clean x message from the channel",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, message, "modCmd");
    if (isModEnabled == null) return;

    if (isModEnabled == 0) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Moderation commands are off! Type **d!setup mod** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("You need the permission `Manage messages` to use this command");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    var amount = parseInt(args[0]);

    if (isNaN(amount)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You must provide a valid number of messages");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (amount < 1 || amount > 99) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You must provide a number **between 1 and 99**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    amount = amount + 1; // for the command message itself
    const fetchedMessages = await message.channel.messages.fetch({ limit: amount });

    const messagesToProcess = fetchedMessages.toJSON().slice(0, amount);

    let deletedCount = 0;

    try {
      const deleted = await message.channel.bulkDelete(messagesToProcess, true);
      deletedCount = deleted.size;
    } catch (error) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription(
          "An error occurred while trying to clean messages, messages older than 14 days cannot be deleted, try a smaller amount"
        );

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription(`Successfully cleaned **${deletedCount}** messages from the channel`);

    try {
      await message.channel.send({ embeds: [embed] }).then(async (msg) => {
        await delay(5000);
        await msg.delete();
      });
    } catch (error) {
      // continue, no need to stop
    }

    // MOD LOGGING HERE
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT modLogChannel FROM Server WHERE serverId = ?", [message.guild.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (row && row.modLogChannel && row.modLogChannel !== "null") {
      const channel = message.guild.channels.cache.get(row.modLogChannel);
      if (channel) {
        embed
          .setColor(0x33ff33)
          .setTitle("🧹 Cleaned Messages")
          .setDescription(`Cleaned **${deletedCount}** messages in <#${message.channel.id}> by **${message.author.tag}**`)
          .setTimestamp();

        try {
          return await channel.send({ embeds: [embed] });
        } catch (error) {
          console.error("Failed to send moderation log message:", error);
        }
      }
    }
  },
};
