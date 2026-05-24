const { EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");

module.exports = {
  name: "warns",
  description: "Check the number of warns of the member",
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

    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need the permission `Moderate members` to use this command");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await client.database.query("SELECT warns FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

    if (row.rowCount === 0 || row.rows[0].warns === 0) {
      embed
        .setColor(0x33ff33)
        .setTitle("🚨" + user.tag + "'s warns")
        .setDescription("The user **" + user.tag + "** has a total of **0** warns");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    embed
      .setColor(0x33ff33)
      .setTitle("🚨" + user.tag + "'s warns")
      .setDescription("The user **" + user.tag + "** has a total of **" + row.rows[0].warns + "** warns");

    const btnClearWarns = new ButtonBuilder().setCustomId("warns-btn-btnClearWarns").setLabel("Clear warns").setStyle(ButtonStyle.Primary);
    const actionRow = new ActionRowBuilder().addComponents(btnClearWarns);

    let sentMessage;

    try {
      sentMessage = await message.reply({ embeds: [embed], components: [actionRow] });
    } catch {
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
        } catch {
          return;
        }
      }

      if (btnInteraction.customId === "warns-btn-btnClearWarns") {
        await client.database.query("UPDATE users SET warns = 0 WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

        embed
          .setColor(0x33ff33)
          .setTitle("✅ Done")
          .setDescription("The warns of **" + user.tag + "** have been cleared");

        btnClearWarns.setStyle(ButtonStyle.Success).setDisabled(true);

        try {
          await btnInteraction.update({ embeds: [embed], components: [actionRow] });
        } catch {
          // DO NOT RETURN
        }

        // MOD LOGGING HERE
        embed
          .setColor(0x33ff33)
          .setTitle("🛂 Cleared member warns")
          .setDescription("**" + user.tag + "**'s warns have been cleared")
          .setFooter({ text: "Action by " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setTimestamp();

        await modActionLogger(client, message, embed);
      }
    });

    collector.on("end", async () => {
      btnClearWarns.setStyle(ButtonStyle.Secondary).setDisabled(true);

      try {
        return await sentMessage.edit({ components: [actionRow] });
      } catch {
        return;
      }
    });
  },
};
