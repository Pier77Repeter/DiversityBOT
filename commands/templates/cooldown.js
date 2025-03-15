module.exports = {
  name: "cooldown",
  description: "Cooldown example, db table is fake",
  cooldown: 30, // cooldown in seconds
  async execute(client, message, args) {
    const cooldownAmount = this.cooldown * 1000; // cooldown in milliseconds
    const unixNow = Date.now();

    // get the last cooldown time from the database
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT cooldown FROM users WHERE userId = ?", [message.author.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) {
      try {
        return await message.reply("Cooldown failed!");
      } catch (error) {
        return;
      }
    }

    const lastCooldown = row.cooldown;
    const expirationTime = lastCooldown + cooldownAmount;

    if (unixNow < expirationTime) {
      const timeLeft = Math.floor(expirationTime / 1000); // convert back for Discord timestamp output
      return await message.reply(`Please wait <t:${timeLeft}:R> before reusing the \`${this.name}\` command.`);
    }

    // update the cooldown time in the database
    await new Promise((resolve, reject) => {
      client.database.run("UPDATE users SET cooldown = ? WHERE userId = ?", [unixNow, message.author.id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // command logic here
    try {
      return await message.reply("Test");
    } catch (error) {
      return;
    }
  },
};
