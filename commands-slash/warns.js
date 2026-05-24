const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags, ButtonStyle, ComponentType, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const configChecker = require("../utils/configChecker");
const modActionLogger = require("../utils/modActionLogger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warns")
    .setDescription("See how many warns the user got")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName("member").setDescription("The user that needs to be checked").setRequired(true)),
  async execute(client, interaction) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, interaction, "mod_cmd");
    if (isModEnabled === null) return;

    if (!isModEnabled) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **/setup** to enable them");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    const member = interaction.options.getMember("member");

    if (!member) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Could not find that member in the server, they left...");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    const checkRow = await client.database.query("SELECT warns FROM users WHERE server_id = $1 AND user_id = $2", [interaction.guildId, member.user.id]);

    if (checkRow.rowCount === 0) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Couldn't warn the user because...they need to use at least **1** of my commands");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    embed
      .setColor(0x33ff33)
      .setTitle("🚨 " + member.user.tag + "'s warns")
      .setDescription("The user **" + member.user.tag + "** has a total of **" + checkRow.rows[0].warns + "** warns");

    // first time we get something like this, format is "s<name>-btn-<btnName>" the 's' stands for slash so it sounds slashwarns-btn-...
    const btnClearWarns = new ButtonBuilder().setCustomId("swarns-btn-btnClearWarns").setLabel("Clear warns").setStyle(ButtonStyle.Primary);
    const actionRow = new ActionRowBuilder().addComponents(btnClearWarns);

    let sentMessage;

    try {
      sentMessage = await interaction.reply({ embeds: [embed], components: [actionRow] });
    } catch {
      return;
    }

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== interaction.user.id) {
        try {
          return await btnInteraction.reply({ content: "You can't use this button, it is not for you", flags: [MessageFlags.Ephemeral] });
        } catch {
          return;
        }
      }

      if (btnInteraction.customId === "swarns-btn-btnClearWarns") {
        await client.database.query("UPDATE users SET warns = 0 WHERE server_id = $1 AND user_id = $2", [interaction.guildId, member.user.id]);

        embed
          .setColor(0x33ff33)
          .setTitle("✅ Done")
          .setDescription("The warns of **" + member.user.tag + "** have been cleared");

        btnClearWarns.setStyle(ButtonStyle.Success).setDisabled(true);

        try {
          await btnInteraction.update({ embeds: [embed], components: [actionRow] });
        } catch {
          return;
        }

        // MOD LOGGING HERE
        embed
          .setColor(0x33ff33)
          .setTitle("🛂 Cleared member warns")
          .setDescription("**" + member.user.tag + "**'s warns have been cleared")
          .setFooter({ text: "Action by " + interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          .setTimestamp();

        await modActionLogger(client, interaction, embed);
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
