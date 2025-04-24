// thing to update json data in DB, at the moment it's only 'items' and 'fishes'
module.exports = async function dbJsonDataSet(client, message, dataName, jsonData) {
  const logPrefix = "[DbJsonDataSet.js/ERROR]:";

  const jsonDataName = dataName.toLowerCase();

  if (jsonDataName != "items" && jsonDataName != "fishes") {
    return console.error(logPrefix, "Invalid data name, must be 'items' or 'fishes'");
  }

  try {
    const stringfiedData = JSON.stringify(jsonData);
    await new Promise((resolve, reject) => {
      client.database.run(
        `UPDATE User SET ${jsonDataName} = ? WHERE serverId = ? AND userId = ?`,
        [stringfiedData, message.guild.id, message.author.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  } catch (error) {
    return console.error(logPrefix, "Something wrong happened while setting JSON data: " + error);
  }
};
