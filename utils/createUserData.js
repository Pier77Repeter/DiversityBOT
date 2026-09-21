// used in messageCreate.js, interactionCreate.js, warn.js and /warn
module.exports = async function createUserData(client, serverId, userId) {
  // now you can S E E the json crap
  const itemsJsonData = {
    itemId1: false,
    itemId2: false,
    itemId2Count: 0,
    itemId3: false,
    itemId3Count: 0,
    itemId4: false,
    itemId5: false,
    itemId6: false,
    itemId7: false,
    itemId8: false,
    itemId9: false,
    itemId10: false,
    itemId10Count: 0,
    itemId11: false,
    itemId11Count: 0,
  };

  const fishesJsonData = {
    fishId1: false,
    fishId1Count: 0,
    fishId2: false,
    fishId2Count: 0,
    fishId3: false,
    fishId3Count: 0,
    fishId4: false,
    fishId4Count: 0,
    fishId5: false,
    fishId5Count: 0,
    fishId6: false,
    fishId6Count: 0,
    fishId7: false,
    fishId7Count: 0,
    fishId8: false,
    fishId8Count: 0,
    fishId9: false,
    fishId9Count: 0,
    fishId10: false,
    fishId10Count: 0,
  };

  // empty, will be filled when users drops something
  const dropsJsonData = {};

  // try to insert this row, if the primary key already exists, just ignore it and move on, only inserting users who actually use the bot
  // LOOK AT https://www.geeksforgeeks.org/sql/cte-in-sql/
  const query = `
      WITH server_insert AS (
        INSERT INTO servers(server_id) 
        VALUES($1) 
        ON CONFLICT (server_id) DO NOTHING
      )
      INSERT INTO users(server_id, user_id, items, fishes, drops) 
      VALUES($1, $2, $3, $4, $5) 
      ON CONFLICT (server_id, user_id) DO NOTHING;
    `;

  // REMEBER TO ADD THIS TEXT FOR EVENTS!!!!
  /*
    INSERT INTO events(server_id, user_id) 
    VALUES($1, $2) ON CONFLICT (server_id, user_id) DO NOTHING;
  */

  const values = [serverId, userId, itemsJsonData, fishesJsonData, dropsJsonData];

  await client.database.query(query, values); // we inserted new data!
};
