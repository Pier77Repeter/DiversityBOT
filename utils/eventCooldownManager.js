const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("EventCooldownManager");

// no need to say everything again, just look at 'cooldownManager().js'
module.exports = async function cooldownManager(client, message, cooldownName, cooldownInSeconds, logError = true) {
  const cooldownAmount = cooldownInSeconds * 1000;
  const unixNow = Date.now();

  try {
    const query = `
      UPDATE events 
      SET ${cooldownName} = CASE 
        WHEN ${cooldownName} + $1::bigint <= $2::bigint THEN $2::bigint
        ELSE ${cooldownName}
      END
      WHERE server_id = $3 AND user_id = $4
      RETURNING ${cooldownName};
    `;

    const res = await client.database.query(query, [cooldownAmount, unixNow, message.guildId, message.author.id]);

    if (res.rowCount === 0) {
      throw new Error(`Failed to find user in database: Server '${message.guildId}' - User '${message.author.id}'`);
    }

    const dbTimestamp = Number(res.rows[0][cooldownName]);

    if (dbTimestamp !== unixNow) {
      const expirationTime = dbTimestamp + cooldownAmount;
      const timeLeft = Math.floor(expirationTime / 1000);
      const statusCode = true;

      return [statusCode, timeLeft];
    }

    return false;
  } catch (error) {
    logger.error(`Error handling cooldown '${cooldownName}': Server '${message.guildId}' - User '${message.author.id}'`, error);

    if (!logError) return null;

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Critical Error")
      .setDescription("Failed to update your cooldown, please **report this error with the server id and your user id**")
      .addFields(
        { name: "Server ID", value: `\`${message.guildId}\``, inline: true },
        { name: "User ID", value: `\`${message.author.id}\``, inline: true },
        { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" },
      );

    try {
      await message.reply({ embeds: [embed] });
    } catch {
      // DO NOT VOMIT
    }

    return null;
  }
};
