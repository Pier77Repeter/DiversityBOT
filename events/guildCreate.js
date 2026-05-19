const { Events } = require("discord.js");
const logger = require("../logger")("GuildCreate");

module.exports = (client) => {
  client.on(Events.GuildCreate, async (guild) => {
    // yay new server!
    await client.database.query("INSERT INTO servers(server_id) VALUES($1)", [guild.id]).catch((error) => {
      logger.error("Error while INSERTING data in db: Server '" + guild.id + "'", error);
    });
  });
};
