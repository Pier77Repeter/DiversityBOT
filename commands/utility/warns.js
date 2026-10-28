const { EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "warns",
  description: "Check the number of warns of the member",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, message, "mod_cmd");
    if (isModEnabled === null) return;

    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **d!setup mod** to enable them");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Missing Permission").setDescription("You need the permission `Moderate Members` to use this command");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;

    const row = await client.database.query("SELECT warns FROM users WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

    if (row.rowCount === 0 || row.rows[0].warns === 0) {
      embed.setColor(0x33ff33).setTitle(`🚨${user.tag}'s Warns`).setDescription(`The user **${user.tag}** has a total of **0** warns`);

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    embed.setColor(0x33ff33).setTitle(`🚨${user.tag}'s Warns`).setDescription(`The user **${user.tag}** has a total of **${row.rows[0].warns}** warns`);

    const btnClearWarns = new ButtonBuilder().setCustomId("warns-btn-btnClearWarns").setLabel("Clear warns").setStyle(ButtonStyle.Primary);
    const actionRow = new ActionRowBuilder().addComponents(btnClearWarns);

    const sentMessage = await message.reply({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);
    if (!sentMessage) return;

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        btnInteraction.reply({ content: "You can't use this button, it is not for you", flags: [MessageFlags.Ephemeral] }).catch(msgErrorHandler);
        return;
      }

      if (btnInteraction.customId === "warns-btn-btnClearWarns") {
        await client.database.query("UPDATE users SET warns = 0 WHERE server_id = $1 AND user_id = $2", [message.guildId, user.id]);

        embed.setColor(0x33ff33).setTitle("✅ Done").setDescription(`The warns of **${user.tag}** have been cleared`);

        btnClearWarns.setStyle(ButtonStyle.Success).setDisabled(true);

        await btnInteraction.update({ embeds: [embed], components: [actionRow] }).catch(msgErrorHandler);

        // MOD LOGGING HERE
        embed
          .setColor(0x33ff33)
          .setTitle("🛂 Cleared Member Warns")
          .setDescription(`**${user.tag}**'s warns have been cleared`)
          .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setTimestamp();

        modActionLogger(client, message, embed);
      }
    });

    collector.on("end", async () => {
      btnClearWarns.setStyle(ButtonStyle.Secondary).setDisabled(true);

      sentMessage.edit({ components: [actionRow] }).catch(msgErrorHandler);
    });
  },
};
