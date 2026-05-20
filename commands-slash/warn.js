const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const configChecker = require("../utils/configChecker");
const modActionLogger = require("../utils/modActionLogger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn an user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName("member").setDescription("The user that needs to be warned").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason this user is being warned for").setMaxLength(1000).setRequired(false)),
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

    const memberToWarn = interaction.options.getMember("member");
    const warnReason = interaction.options.getString("reason") || "No reason provided";

    if (!memberToWarn) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Could not find that member in the server, they left...");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    if (memberToWarn.id === interaction.user.id) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't warn yourself lol");

      try {
        return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } catch {
        return;
      }
    }

    // if user dosen't exist in database we gotta let them know
    const checkRow = await client.database.query("SELECT EXISTS (SELECT 1 FROM users WHERE server_id = $1 AND user_id = $2)", [interaction.guildId, memberToWarn.user.id]);

    if (!checkRow.rows[0].exists) {
      // an user MUST be warned even if he never used the bot, must create his data NOW
      // no bots in my db
      if (memberToWarn.user.bot) {
        embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't warn a Discord Bot");

        try {
          return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        } catch {
          return;
        }
      }

      const itemsJsonData = {
        itemId1: false,
        itemId2: false,
        itemId2Count: 0,
        itemId3: false,
        itemId3Count: 0,
        itemId4: false,
        itemId5: false,
        itemId6: false,
        itemId7: false,
        itemId8: false,
        itemId9: false,
        itemId10: false,
        itemId10Count: 0,
        itemId11: false,
        itemId11Count: 0,
      };

      const fishesJsonData = {
        fishId1: false,
        fishId1Count: 0,
        fishId2: false,
        fishId2Count: 0,
        fishId3: false,
        fishId3Count: 0,
        fishId4: false,
        fishId4Count: 0,
        fishId5: false,
        fishId5Count: 0,
        fishId6: false,
        fishId6Count: 0,
        fishId7: false,
        fishId7Count: 0,
        fishId8: false,
        fishId8Count: 0,
        fishId9: false,
        fishId9Count: 0,
        fishId10: false,
        fishId10Count: 0,
      };

      await client.database.query("INSERT INTO users(server_id, user_id, items, fishes) VALUES($1, $2, $3, $4)", [
        interaction.guildId,
        memberToWarn.user.id,
        itemsJsonData,
        fishesJsonData,
      ]);
    }

    await client.database.query("UPDATE users SET warns = warns + 1 WHERE server_id = $1 AND user_id = $2", [interaction.guildId, memberToWarn.user.id]);

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("The user **" + memberToWarn.user.tag + "** has been warned");

    try {
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } catch {
      // continue
    }

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🛂 Warned member")
      .setDescription("**" + memberToWarn.user.tag + "** has been warned" + "\n" + "Reason: " + warnReason)
      .setFooter({ text: "Action by " + interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await modActionLogger(client, interaction, embed);
  },
};
