// checks for server config in database
module.exports = async function configChecker(client, configName, serverId) {
  // This is very useful since it's gonna save tons of lines and time when checking configs
  const logPrefix = "[ConfigChecker.js/ERROR]:";

  // checking for valid config name in db
  const validConfigNames = ["modCmd", "musiCmd", "eventCmd", "communityCmd"]; // may add more
  if (!validConfigNames.includes(configName)) {
    console.error(logPrefix, "Invalid config name, must be 'modCmd', 'musiCmd', 'eventCmd' or 'communityCmd'");
    return null;
  }

  try {
    const row = await new Promise((resolve, reject) => {
      client.database.get(`SELECT ${configName} FROM Server WHERE serverId = ?`, serverId, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!row) return null;

    const configValue = row[configName];

    return configValue;
  } catch (error) {
    console.error(logPrefix + " Error getting config '" + configName + "': " + error);
    return null;
  }
};
