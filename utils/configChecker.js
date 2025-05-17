const { EmbedBuilder } = require("discord.js");

// checks for server config in database
module.exports = async function configChecker(client, message, configName) {
  // This is very useful since it's gonna save tons of lines and time when checking configs
  const logPrefix = "[ConfigChecker.js/ERROR]:";

  // checking for valid config name in db
  const validConfigNames = ["modCmd", "musiCmd", "eventCmd", "communityCmd"]; // may add more
  if (!validConfigNames.includes(configName)) {
    // assign error handling to the catch block
    throw "invalid config name, must be 'modCmd', 'musiCmd', 'eventCmd' or 'communityCmd'";
  }

  try {
    const row = await new Promise((resolve, reject) => {
      client.database.get(`SELECT ${configName} FROM Server WHERE serverId = ?`, message.guild.id, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) throw "server '" + message.guild.id + "' was not found in database";

    const configValue = row[configName];

    return configValue;
  } catch (error) {
    console.error(logPrefix + " Error getting config '" + configName + "': " + error);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("Failed to get server config, please **report this error with your server ID**")
      .addFields({ name: "Submit here", value: "https://discord.gg/KxadTdz" });

    try {
      await message.reply({ embeds: [embed] });
    } catch (error) {
      // continue
    }

    return null;
  }
};
