const { Events } = require("discord.js");
const logger = require("../logger")("GuildMemberRemove");
// remove data of a leaving user from a server
module.exports = (client) => {
  client.on(Events.GuildMemberRemove, async (member) => {
    await client.database.query("DELETE FROM users WHERE server_id = $1 AND user_id = $2", [member.guildId, member.id]).catch((error) => {
      logger.error(`Error while DELETING data in db: Server '${member.guildId}' - User '${member.id}'`, error);
    });
  });
};
