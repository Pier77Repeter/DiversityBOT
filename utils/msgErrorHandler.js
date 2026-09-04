// When the bot fails to send a message, it's better to log the issue IF...
// it's not related to a missing permission, command message got deleted or whatever Discord API error
const { DiscordAPIError } = require("discord.js");

module.exports = function msgErrorHandler(error) {
  if (error instanceof DiscordAPIError) return;

  throw error;
};
