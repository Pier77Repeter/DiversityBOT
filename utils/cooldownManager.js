const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("CooldownManager");

// this is very useful since it's gonna save tons of lines and time when implementing cooldowns for the commands
module.exports = async function cooldownManager(client, message, cooldownName, cooldownInSeconds, logError = true) {
  const cooldownAmount = cooldownInSeconds * 1000; // cooldown to milliseconds
  const unixNow = Date.now(); // this is needed since we work with unix time

  try {
    // if (old_timestamp + cooldown_amount) <= now, update it to now, otherwise keep the old timestamp, lastly return whichever value is set (https://www.postgresql.org/docs/18/plpgsql-control-structures.html)
    const query = `
      UPDATE users 
      SET ${cooldownName} = CASE 
        WHEN ${cooldownName} + $1::bigint <= $2::bigint THEN $2::bigint
        ELSE ${cooldownName}
      END
      WHERE server_id = $3 AND user_id = $4
      RETURNING ${cooldownName};
    `;

    const res = await client.database.query(query, [cooldownAmount, unixNow, message.guildId, message.author.id]);

    // row.rows[0].exists IS ONLY FOR SELECT EXISTS(), if user of server isn't found go to catch block
    if (res.rowCount === 0) {
      throw new Error(`Failed to find user in database: Server '${message.guildId}' - User '${message.author.id}'`);
    }

    const dbTimestamp = Number(res.rows[0][cooldownName]);

    // if the unix time in db is bigger than the current unix time this means user is still in cooldown
    if (dbTimestamp !== unixNow) {
      const expirationTime = dbTimestamp + cooldownAmount;
      const timeLeft = Math.floor(expirationTime / 1000); // format for Discord `<t:timestamp:R>`
      const statusCode = true; // cooldown is active

      return [statusCode, timeLeft];
    }

    return false; // cooldown was off and the update went good :thumbsup:
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
      // do not vomit anything
    }

    return null; // in case of an error (check is in the command)
  }
};
