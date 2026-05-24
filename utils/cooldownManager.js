const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("CooldownManager");

// this is very useful since it's gonna save tons of lines and time when implementing cooldowns for the commands
module.exports = async function cooldownManager(client, message, cooldownName, cooldownInSeconds, logError = true) {
  const cooldownAmount = cooldownInSeconds * 1000; // cooldown to milliseconds
  const unixNow = Date.now(); // this is needed since we work with unix time

  try {
    // first we get the cooldown from the db (it should exist since user data gets INSERTED in messageCreate event, before this)
    const row = await client.database.query(`SELECT ${cooldownName} FROM users WHERE server_id = $1 AND user_id = $2`, [message.guild.id, message.author.id]);

    // row.rows[0].exists IS ONLY FOR SELECT EXISTS(), if user of server isn't found go to catch block
    if (row.rowCount === 0) throw new Error("Failed to find in database: Server '" + message.guild.id + "' - User '" + message.author.id + "'");

    const lastCooldown = Number(row.rows[0][cooldownName]); // MUST USE 'Number()' to convert the BIGINT string
    const expirationTime = lastCooldown + cooldownAmount;

    // if the unix time in db is bigger than the current unix time this means user is still in cooldown
    if (unixNow < expirationTime) {
      const timeLeft = Math.floor(expirationTime / 1000); // convert back for Discord timestamp output
      const statusCode = true; // true means it's active so we need to check if (cooldown) in the commands
      const cooldownData = [statusCode, timeLeft];

      return cooldownData;
    }

    // update the cooldown immediatly
    await client.database.query(`UPDATE users SET ${cooldownName} = $1 WHERE server_id = $2 AND user_id = $3`, [unixNow, message.guild.id, message.author.id]);

    return false; // cooldown was off and the update went good :thumbsup:
  } catch (error) {
    logger.error("Error handling cooldown '" + cooldownName + "': Server '" + message.guild.id + "' - User '" + message.author.id + "'", error);

    if (!logError) return null; // sometimes we dont want this, so do not log since it's set to false

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Critical error")
      .setDescription("Failed to update your cooldown, please **report this error with the server ID and your user ID**")
      .addFields(
        { name: "Server ID", value: `\`${message.guild.id}\``, inline: true },
        { name: "User ID", value: `\`${message.author.id}\``, inline: true },
        { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" },
      );

    try {
      await message.reply({ embeds: [embed] });
    } catch {
      // continue
    }

    return null; // in case of an error (check is in the command)
  }
};
