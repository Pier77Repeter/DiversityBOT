const { EmbedBuilder } = require("discord.js");
const logger = require("../logger")("ConfigChecker");

// this is very useful since it's gonna save tons of lines and time when checking configs
module.exports = async function configChecker(client, message, configName) {
  // checking for valid config name in db
  const validConfigNames = ["modCmd", "musiCmd", "eventCmd", "communityCmd", "levelingCmd"]; // may add more
  if (!validConfigNames.includes(configName)) {
    // error will be disaplyed with the name of the command
    throw "Invalid config name, must be 'modCmd', 'musiCmd', 'eventCmd', 'communityCmd' or 'levelingCmd'";
  }

  try {
    const row = await new Promise((resolve, reject) => {
      client.database.get(`SELECT ${configName} FROM Server WHERE serverId = ?`, message.guild.id, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) throw "Server '" + message.guild.id + "' was not found in database";

    const configValue = row[configName];

    return configValue;
  } catch (error) {
    // this is important, we must log it
    logger.error("Error getting config '" + configName + "': Server " + message.guild.id, error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("⚠️ Critical error")
      .setDescription("Failed to get server config, please **report this error with your server ID**")
      .addFields({ name: "Submit report here", value: "https://discord.gg/KxadTdz" });

    try {
      await message.reply({ embeds: [embed] });
    } catch (error) {
      // continue
    }

    return null;
  }
};
