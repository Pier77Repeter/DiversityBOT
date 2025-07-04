const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
  ButtonStyle,
  ComponentType,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const configChecker = require("../utils/configChecker");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warns")
    .setDescription("See how many warns the user got")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName("member").setDescription("The user that needs to be checked").setRequired(true)),
  async execute(client, interaction) {
    const embed = new EmbedBuilder();

    const isModEnabled = await configChecker(client, interaction, "modCmd");
    if (isModEnabled == null) return;

    if (isModEnabled == 0) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Moderation commands are off! Type **/setup** to enable them");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return;
      }
    }

    const member = interaction.options.getMember("member");

    if (!member) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Could not find that member in the server, they left...");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch (error) {
        return;
      }
    }

    const checkRow = await new Promise((resolve, reject) => {
      client.database.get("SELECT warns FROM User WHERE serverId = ? AND userId = ?", [interaction.guild.id, member.user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!checkRow || checkRow.warns == 0) {
      embed
        .setColor(0x33ff33)
        .setTitle("🚨" + member.user.tag + "'s warns")
        .setDescription("The user **" + member.user.tag + "** has a total of **0** warns");

      try {
        return await interaction.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    embed
      .setColor(0x33ff33)
      .setTitle("🚨" + member.user.tag + "'s warns")
      .setDescription("The user **" + member.user.tag + "** has a total of **" + checkRow.warns + "** warns");

    // first time we get something like this, format is "s<name>-btn-<btnName>" the 's' stands for slash so it sounds slashwarns-btn-...
    const btnClearWarns = new ButtonBuilder().setCustomId("swarns-btn-btnClearWarns").setLabel("Clear warns").setStyle(ButtonStyle.Primary);
    const actionRow = new ActionRowBuilder().addComponents(btnClearWarns);

    var sentMessage;

    try {
      sentMessage = await interaction.reply({ embeds: [embed], components: [actionRow] });
    } catch (error) {
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
        } catch (error) {
          return;
        }
      }

      if (btnInteraction.customId === "swarns-btn-btnClearWarns") {
        await new Promise((resolve, reject) => {
          client.database.run("UPDATE User SET warns = 0 WHERE serverId = ? AND userId = ?", [interaction.guild.id, member.user.id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        embed
          .setColor(0x33ff33)
          .setTitle("✅ Done")
          .setDescription("The warns of **" + member.user.tag + "** have been cleared");

        btnClearWarns.setStyle(ButtonStyle.Success).setDisabled(true);

        try {
          await btnInteraction.update({ embeds: [embed], components: [actionRow] });
        } catch (error) {
          return;
        }

        // MOD LOGGING HERE
        const row = await new Promise((resolve, reject) => {
          client.database.get("SELECT modLogChannel FROM Server WHERE serverId = ?", [interaction.guild.id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        if (row && row.modLogChannel && row.modLogChannel !== "null") {
          const channel = interaction.guild.channels.cache.get(row.modLogChannel);
          if (channel) {
            embed
              .setColor(0x33ff33)
              .setTitle("🛂 Cleared member warns")
              .setDescription("**" + member.user.tag + "**'s warns have been cleared")
              .setFooter({ text: "Action by " + interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
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
