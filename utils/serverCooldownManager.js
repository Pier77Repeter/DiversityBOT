const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("ServerCooldownManager");

// only for server cooldowns, unlike "cooldownManager.js" which is for user cooldowns
module.exports = async function serverCooldownManager(client, message, cooldownName, cooldownInSeconds) {
  const cooldownAmount = cooldownInSeconds * 1000; // cooldown to milliseconds
  const unixNow = Date.now(); // this is needed since we work with unix time

  try {
    // first we get the cooldown from the db (it should exist since server data gets INSERTED in "guildCreate" event, before this)
    const row = await new Promise((resolve, reject) => {
      client.database.get(`SELECT ${cooldownName} FROM Server WHERE serverId = ?`, [message.guild.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // return null if db operation failed, so we need to check in the commands if return is null too
    if (!row) throw "Server '" + message.guild.id + "' wasn't found in database";

    const lastCooldown = row[cooldownName];
    const expirationTime = lastCooldown + cooldownAmount;

    // if the unix time in db is bigger than the current unix time this means user is still in cooldown
    if (unixNow < expirationTime) {
      const timeLeft = Math.floor(expirationTime / 1000); // convert back for Discord timestamp output
      const statusCode = 1; // 1 means it's active so we need to check if cooldown == 0 in the commands
      const cooldownData = [statusCode, timeLeft];

      return cooldownData;
    }

    // update the cooldown immediatly
    await new Promise((resolve, reject) => {
      client.database.run(`UPDATE Server SET ${cooldownName} = ? WHERE serverId = ?`, [unixNow, message.guild.id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return 0; // cooldown is off and everything went good :thumbsup:
  } catch (error) {
    logger.error("Error handling cooldown '" + cooldownName + "': Server '" + message.guild.id + "'", error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Critical error")
      .setDescription("Failed to update server cooldown, please **report this error with your server ID**")
      .addFields({ name: "Submit report here", value: "https://discord.gg/KxadTdz" });

    try {
      await message.reply({ embeds: [embed] });
    } catch (error) {
      // continue
    }

    return null; // in case of an error (check is in the command)
  }
};
