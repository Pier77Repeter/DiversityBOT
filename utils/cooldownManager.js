const { EmbedBuilder } = require("discord.js");

// This is very useful since it's gonna save tons of lines and time when implementing cooldowns for the commands
module.exports = async function cooldownManager(client, message, cooldownName, cooldownInSeconds) {
  const logPrefix = "[CooldownManager.js/ERROR]:";

  const cooldownAmount = cooldownInSeconds * 1000; // cooldown to milliseconds
  const unixNow = Date.now(); // this is needed since we work with unix time

  try {
    // first we get the cooldown from the db (it should exist since user data gets INSERTED in messageCreate event, before this)
    const row = await new Promise((resolve, reject) => {
      client.database.get(
        `SELECT ${cooldownName} FROM User WHERE serverId = ? AND userId = ?`,
        [message.guild.id, message.author.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // return null if db operation failed, so we need to check in the commands if return is null too
    if (!row) throw "user '" + message.author.id + "' was not found in database";

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
        [unixNow, message.guild.id, message.author.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    return 0; // cooldown is off and everything went good :thumbsup:
  } catch (error) {
    console.error(logPrefix + " Error handling cooldown '" + cooldownName + "': " + error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("Failed to update your cooldown, please **report this error with your user ID**")
      .addFields({ name: "Submit report here", value: "https://discord.gg/KxadTdz" });

    try {
      await message.reply({ embeds: [embed] });
    } catch (error) {
      // continue
    }

    return null; // in case of an error (check is in the command)
  }
};
