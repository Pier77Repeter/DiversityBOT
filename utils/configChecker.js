// This is very useful since it's gonna save tons of lines and time when checking configs
const logPrefix = "[ConfigChecker.js]:";

module.exports = async function configChecker(client, configName, serverId) {
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
