const { Events } = require("discord.js");
const logger = require("../logger")("MessageDelete");

module.exports = (client) => {
  client.on(Events.MessageDelete, async (message) => {
    // if the message is old/uncached it won't have an author
    if (message.partial || !message.author) return;

    try {
      const channelRow = await client.database.query("SELECT EXISTS (SELECT 1 FROM channels WHERE channel_id = $1)", [message.channel.id]);

      // if it dosen't exist then let's insert it
      if (!channelRow.rows[0].exists) {
        return await client.database.query("INSERT INTO channels VALUES ($1, $2, $3, $4)", [message.channel.id, message.content, message.author.id, message.guild.id]);
      }

      // already exist, just update
      await client.database.query("UPDATE channels SET sniped_message = $1, sniped_message_author_id = $2 WHERE channel_id = $3", [
        message.content,
        message.author.id,
        message.channel.id,
      ]);
    } catch (error) {
      logger.error("Failed to manage channels table: Server '" + message.guild.id + "' - Channel '" + message.channel.id + "'", error);
    }
  });
};
