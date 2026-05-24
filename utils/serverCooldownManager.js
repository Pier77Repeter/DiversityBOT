const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("ServerCooldownManager");

// only for server cooldowns, unlike "cooldownManager.js" which is for user cooldowns
module.exports = async function serverCooldownManager(client, message, cooldownName, cooldownInSeconds) {
  const cooldownAmount = cooldownInSeconds * 1000; // cooldown to milliseconds
  const unixNow = Date.now(); // this is needed since we work with unix time

  try {
    // first we get the cooldown from the db (it should exist since server data gets INSERTED in "guildCreate" event, before this)
    const row = await client.database.query(`SELECT ${cooldownName} FROM servers WHERE server_id = $1`, [message.guild.id]);

    // if server isn't found go to catch block
    if (row.rowCount === 0) throw new Error("Failed to find in database: Server '" + message.guild.id + "'");

    const lastCooldown = Number(row.rows[0][cooldownName]); // do not forget 'Number()'
    const expirationTime = lastCooldown + cooldownAmount;

    // if the unix time in db is bigger than the current unix time this means user is still in cooldown
    if (unixNow < expirationTime) {
      const timeLeft = Math.floor(expirationTime / 1000); // convert back for Discord timestamp output
      const statusCode = true; // true means it's active so we need to check if cooldown == 0 in the commands
      const cooldownData = [statusCode, timeLeft];

      return cooldownData;
    }

    // update the cooldown immediatly
    await client.database.query(`UPDATE servers SET ${cooldownName} = $1 WHERE server_id = $2`, [unixNow, message.guild.id]);

    return false; // cooldown was off and the update went good :thumbsup:
  } catch (error) {
    logger.error("Error handling cooldown '" + cooldownName + "': Server '" + message.guild.id + "'", error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Critical error")
      .setDescription("Failed to update the server cooldown, please **report this error with the server ID**")
      .addFields({ name: "Server ID", value: `\`${message.guild.id}\``, inline: true }, { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" });

    try {
      await message.reply({ embeds: [embed] });
    } catch {
      // continue
    }

    return null; // in case of an error (check is in the command)
  }
};
