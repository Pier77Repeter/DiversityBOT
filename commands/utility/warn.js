const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");

module.exports = {
  name: "warn",
  description: "Warn a member",
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

    if (!message.mentions.members.first()) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need to mention the member you want to warn");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    if (message.mentions.members.first().user.id === message.author.id) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't warn yourself lol");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    const userToWarn = message.mentions.members.first();
    const warnReason = args.slice(1).join(" ") || "No reason provided";

    // can warn bots
    if (userToWarn.user.bot) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't warn a Discord Bot");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    // if user dosen't exist in database we gotta let them know
    const checkRow = await client.database.query("SELECT EXISTS (SELECT 1 FROM users WHERE server_id = $1 AND user_id = $2)", [message.guildId, userToWarn.user.id]);

    if (!checkRow.rows[0].exists) {
      // an user MUST be warned even if he never used the bot, must create his data NOW
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
        message.guildId,
        userToWarn.user.id,
        itemsJsonData,
        fishesJsonData,
      ]);
    }

    await client.database.query("UPDATE users SET warns = warns + 1 WHERE server_id = $1 AND user_id = $2", [message.guildId, userToWarn.user.id]);

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("The user **" + userToWarn.user.tag + "** has been warned" + "\n" + "Reason: " + warnReason);

    try {
      await message.reply({ embeds: [embed] });
    } catch {
      // continue
    }

    // MOD LOGGING HERE
    embed
      .setColor(0x33ff33)
      .setTitle("🛂 Warned member")
      .setDescription("**" + userToWarn.user.tag + "** has been warned" + "\n" + "Reason: " + warnReason)
      .setFooter({ text: "Action by " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await modActionLogger(client, message, embed);
  },
};
