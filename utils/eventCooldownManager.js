const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("EventCooldownManager");

// no need to say everything again, just look at 'cooldownManager().js'
module.exports = async function eventCooldownManager(client, message, cooldownName, cooldownInSeconds, logError = true) {
  const cooldownAmount = cooldownInSeconds * 1000;
  const unixNow = Date.now();

  try {
    const row = await client.database.query(`SELECT ${cooldownName} FROM events WHERE server_id = $1 AND user_id = $2`, [message.guild.id, message.author.id]);

    if (row.rowCount === 0) throw new Error("Event user '" + message.author.id + "' from Server '" + message.guild.id + "' was not found in database");

    const lastCooldown = Number(row.rows[0][cooldownName]);
    const expirationTime = lastCooldown + cooldownAmount;

    if (unixNow < expirationTime) {
      const timeLeft = Math.floor(expirationTime / 1000);
      const statusCode = true;
      const cooldownData = [statusCode, timeLeft];

      return cooldownData;
    }

    await client.database.query(`UPDATE events SET ${cooldownName} = $1 WHERE server_id = $2 AND user_id = $3`, [unixNow, message.guild.id, message.author.id]);

    return false;
  } catch (error) {
    logger.error("Error handling event cooldown '" + cooldownName + "': Server '" + message.guild.id + "' - User '" + message.author.id + "'", error);

    if (!logError) return null;

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
    } catch {}

    return null;
  }
};
