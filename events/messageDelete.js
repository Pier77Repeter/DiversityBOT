const { Events } = require("discord.js");
const logger = require("../logger")("MessageDelete");

module.exports = (client) => {
  client.on(Events.MessageDelete, async (message) => {
    // if the message is old/uncached it won't have an author or user is a bot
    if (message.partial || !message.author || message.author.bot) return;

    try {
      // ensure server row exists first then insert or update the channel
      const query = `
        WITH ensure_server AS (
          INSERT INTO servers (server_id)
          VALUES ($4)
          ON CONFLICT (server_id) DO NOTHING
        )
        INSERT INTO channels (channel_id, sniped_message, sniped_message_author_id, server_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (channel_id) 
        DO UPDATE SET 
          sniped_message = EXCLUDED.sniped_message,
          sniped_message_author_id = EXCLUDED.sniped_message_author_id;
      `;

      await client.database.query(query, [message.channel.id, message.content, message.author.id, message.guildId]);
    } catch (error) {
      logger.error(`Failed to manage channels table: Server '${message.guildId}' - Channel '${message.channel.id}'`, error);
    }
  });
};
