const { EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags } = require("discord.js");
const configChecker = require("../../utils/configChecker");

module.exports = {
  name: "warns",
  description: "Check the number of warns of the member",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, message, "modCmd");
    if (isModEnabled == null) return;

    if (isModEnabled == 0) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **d!setup mod** to enable them");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need the permission `Moderate members` to use this command");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT warns FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row || row.warns == 0) {
      embed
        .setColor(0x33ff33)
        .setTitle("🚨" + user.tag + "'s warns")
        .setDescription("The user **" + user.tag + "** has a total of **0** warns");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    embed
      .setColor(0x33ff33)
      .setTitle("🚨" + user.tag + "'s warns")
      .setDescription("The user **" + user.tag + "** has a total of **" + row.warns + "** warns");

    const btnClearWarns = new ButtonBuilder().setCustomId("warns-btn-btnClearWarns").setLabel("Clear warns").setStyle(ButtonStyle.Primary);
    const actionRow = new ActionRowBuilder().addComponents(btnClearWarns);

    var sentMessage;

    try {
      sentMessage = await message.reply({ embeds: [embed], components: [actionRow] });
    } catch (error) {
      return;
    }

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await btnInteraction.reply({ content: "You can't use this button, it is not for you", flags: [MessageFlags.Ephemeral] });
        } catch (error) {
          return;
        }
      }

      if (btnInteraction.customId === "warns-btn-btnClearWarns") {
        await new Promise((resolve, reject) => {
          client.database.run("UPDATE User SET warns = 0 WHERE serverId = ? AND userId = ?", [message.guild.id, user.id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        embed
          .setColor(0x33ff33)
          .setTitle("✅ Done")
          .setDescription("The warns of **" + user.tag + "** have been cleared");

        btnClearWarns.setStyle(ButtonStyle.Success).setDisabled(true);

        try {
          await btnInteraction.update({ embeds: [embed], components: [actionRow] });
        } catch (error) {
          return;
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
              .setTitle("🛂 Cleared member warns")
              .setDescription("**" + user.tag + "**'s warns have been cleared")
              .setFooter({ text: "Action by " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
              .setTimestamp();

            try {
              return await channel.send({ embeds: [embed] });
            } catch (error) {
              return;
            }
          }
        }
      }
    });

    collector.on("end", async () => {
      btnClearWarns.setStyle(ButtonStyle.Secondary).setDisabled(true);

      try {
        return await sentMessage.edit({ components: [actionRow] });
      } catch (error) {
        return;
      }
    });
  },
};
