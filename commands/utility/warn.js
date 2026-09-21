const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const configChecker = require("../../utils/configChecker");
const modActionLogger = require("../../utils/modActionLogger");
const msgErrorHandler = require("../../utils/msgErrorHandler");
const createUserData = require("../../utils/createUserData");

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
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need the permission `Moderate members` to use this command");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    if (!message.mentions.members.first()) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need to mention the member you want to warn");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    if (message.mentions.members.first().user.id === message.author.id) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't warn yourself lol");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    const userToWarn = message.mentions.members.first();
    const warnReason = args.slice(1).join(" ") || "No reason provided";

    // can warn bots
    if (userToWarn.user.bot) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You can't warn a Discord Bot");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return msgErrorHandler(error);
      }
    }

    // if user dosen't exist in database we gotta create it
    const checkRow = await client.database.query("SELECT EXISTS (SELECT 1 FROM users WHERE server_id = $1 AND user_id = $2)", [message.guildId, userToWarn.user.id]);

    if (!checkRow.rows[0].exists) {
      // an user MUST be warned even if he never used the bot, must create his data NOW
      await createUserData(client, message.guildId, userToWarn.user.id);
    }

    await client.database.query("UPDATE users SET warns = warns + 1 WHERE server_id = $1 AND user_id = $2", [message.guildId, userToWarn.user.id]);

    embed
      .setColor(0x33ff33)
      .setTitle("✅ Done")
      .setDescription("The user **" + userToWarn.user.tag + "** has been warned" + "\n" + "Reason: " + warnReason);

    try {
      await message.reply({ embeds: [embed] });
    } catch (error) {
      msgErrorHandler(error);
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
