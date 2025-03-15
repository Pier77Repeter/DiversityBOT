const { Events } = require("discord.js");

module.exports = (client) => {
  const logPrefix = "[MessageDelete]:";

  client.on(Events.MessageDelete, async (message) => {
    // db setting up channel
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT * FROM Channel WHERE channelId = ?", message.channel.id, (err, row) => {
        if (err) {
          console.log(logPrefix + " Error: " + err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!row) {
      await new Promise((resolve, reject) => {
        client.database.run(
          "INSERT INTO Channel VALUES (?, ?, ?, ?)",
          [message.channel.id, message.content, message.author.id, message.guild.id],
          (err) => {
            if (err) {
              console.log(logPrefix + " Error: " + err);
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    } else {
      await new Promise((resolve, reject) => {
        client.database.run(
          "UPDATE Channel SET snipedMessage = ?, snipedMessageAuthorId = ? WHERE channelId = ?",
          [message.content, message.author.id, message.channel.id],
          (err) => {
            if (err) {
              console.log(logPrefix + " Error: " + err);
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    }
  });
};
