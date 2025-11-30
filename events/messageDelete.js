const { Events } = require("discord.js");
const logger = require("../logger")("MessageDelete");

module.exports = (client) => {
  client.on(Events.MessageDelete, async (message) => {
    try {
      // db setting up channel
      const row = await new Promise((resolve, reject) => {
        client.database.get("SELECT * FROM Channel WHERE channelId = ?", message.channel.id, (err, row) => {
          if (err) {
            reject("Failed to SELECT 'Channel' from database\n" + err);
          } else {
            resolve(row);
          }
        });
      });

      // if it dosen't exist then let's insert it
      if (!row) {
        await new Promise((resolve, reject) => {
          client.database.run("INSERT INTO Channel VALUES (?, ?, ?, ?)", [message.channel.id, message.content, message.author.id, message.guild.id], (err) => {
            if (err) {
              reject("Failed to INSERT 'Channel' values in database\n" + err);
            } else {
              resolve();
            }
          });
        });
      } else {
        // already exist, just update
        await new Promise((resolve, reject) => {
          client.database.run(
            "UPDATE Channel SET snipedMessage = ?, snipedMessageAuthorId = ? WHERE channelId = ?",
            [message.content, message.author.id, message.channel.id],
            (err) => {
              if (err) {
                reject("Failed to UPDATE deleted message in database\n" + err);
              } else {
                resolve();
              }
            }
          );
        });
      }
    } catch (error) {
      return logger.error(error);
    }
  });
};
