const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("ServerCooldownManager");

// only for server cooldowns, unlike "cooldownManager.js" which is for user cooldowns
module.exports = async function serverCooldownManager(client, message, cooldownName, cooldownInSeconds) {
  const cooldownAmount = cooldownInSeconds * 1000; // cooldown to milliseconds
  const unixNow = Date.now(); // this is needed since we work with unix time

  try {
    // first we get the cooldown from the db (it should exist since server data gets INSERTED in "guildCreate" event, before this), already explained in cooldownManager.js (https://www.postgresql.org/docs/18/plpgsql-control-structures.html)
    const query = `
      UPDATE servers 
      SET ${cooldownName} = CASE 
        WHEN ${cooldownName} + $1::bigint <= $2::bigint THEN $2::bigint
        ELSE ${cooldownName}
      END
      WHERE server_id = $3
      RETURNING ${cooldownName};
    `;

    const res = await client.database.query(query, [cooldownAmount, unixNow, message.guildId]);

    // if server isn't found go to catch block
    if (res.rowCount === 0) {
      throw new Error("Failed to find in database: Server '" + message.guildId + "'");
    }

    const dbTimestamp = Number(res.rows[0][cooldownName]); // do not forget 'Number()'

    // if the unix time in db is bigger than the current unix time this means user is still in cooldown
    if (dbTimestamp !== unixNow) {
      const expirationTime = dbTimestamp + cooldownAmount;
      const timeLeft = Math.floor(expirationTime / 1000); // convert back for Discord timestamp output
      const statusCode = true; // true means it's active so we need to check if cooldown == 0 in the commands
      const cooldownData = [statusCode, timeLeft];

      return cooldownData;
    }

    // update the cooldown immediatly
    return false; // cooldown was off and the update went good :thumbsup:
  } catch (error) {
    logger.error("Error handling cooldown '" + cooldownName + "': Server '" + message.guildId + "'", error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Critical error")
      .setDescription("Failed to update the server cooldown, please **report this error with the server id**")
      .addFields({ name: "Server ID", value: `\`${message.guildId}\``, inline: true }, { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" });

    try {
      await message.reply({ embeds: [embed] });
    } catch {
      // continue
    }

    return null; // in case of an error (check is in the command)
  }
};
