// This is very useful since it's gonna save tons of lines and time when implementing cooldowns for the commands
const logPrefix = "[cooldownManager.js]:";

module.exports = async function cooldownManager(client, cooldownName, cooldownInSeconds, serverId, userId) {
  const cooldownAmount = cooldownInSeconds * 1000; // cooldown to milliseconds
  const unixNow = Date.now(); // this is needed since we work with unix time

  try {
    // first we get the cooldown from the db (it should exist since userData gets INSERTED in messageCreate event, before this)
    const row = await new Promise((resolve, reject) => {
      client.database.get(
        `SELECT ${cooldownName} FROM User WHERE serverId = ? AND userId = ?`,
        [serverId, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // return null if db operation failed, so we need to check in the commands if return is null too
    if (!row) return null;

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
      client.database.run(
        `UPDATE User SET ${cooldownName} = ? WHERE serverId = ? AND userId = ?`,
        [unixNow, serverId, userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    return 0; // cooldown is off and everything went good :thumbsup:
  } catch (error) {
    console.log(logPrefix + " Error handling cooldown '" + cooldownName + "': " + error);
    return null; // in case of an error (check is in the command)
  }
};
