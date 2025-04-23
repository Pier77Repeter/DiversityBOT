// thing to update json data in DB, at the moment it's only 'items' and 'fishes'
module.exports = async function dbJsonDataUpdater(client, message, name, jsonData) {
  const stringFiedData = JSON.stringify(jsonData);
  await new Promise((resolve, reject) => {
    client.database.run(
      `UPDATE User SET ${name} = ? WHERE serverId = ? AND userId = ?`,
      [stringFiedData, message.guild.id, message.author.id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};
