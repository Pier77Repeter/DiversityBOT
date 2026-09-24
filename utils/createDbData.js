// used in messageCreate.js, interactionCreate.js, warn.js and /warn
module.exports = async function createDbData(client, serverId, userId) {
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

  const serverDropsJsonData = [
    {
      id: "1",
      type: "item",
      name: "DiversityGem",
      desc: "The finest gem in all of Earth",
      chance: 0.01,
    },
    {
      id: "2",
      type: "money",
      name: "Lucky Lottery Ticket",
      desc: "The lottery ticket you always dream to win",
      chance: 0.7,
      money: 1000000,
    },
    {
      id: "3",
      type: "role",
      name: "Special Golden",
      desc: "A secret version of the Golden role!",
      chance: 2,
      role_id: "784816759886577694",
    },
    {
      id: "4",
      type: "item",
      name: "Notch's Golden Apple",
      desc: "The uncraftable apple of Minecraft",
      chance: 7,
    },
    {
      id: "5",
      type: "money",
      name: "Money on the ground",
      desc: "Well i guess you can just take them for free",
      chance: 15,
      money: 10,
    },
    {
      id: "6",
      type: "role",
      name: "Stupidity",
      desc: "Even the RNG itself thinks you are stupid",
      chance: 36,
      role_id: "788002186273095730",
    },
    {
      id: "7",
      type: "unknown",
      name: "THE UNKNOWN",
      desc: "This is breaks the fabric of reality itself, nobody knows what is this and what it does, but one thing is certain, you have been blessed by the RNG",
      chance: 0.00001,
    },
  ];

  // try to insert this row, if the primary key already exists, just ignore it and move on, only inserting users who actually use the bot
  // LOOK AT https://www.geeksforgeeks.org/sql/cte-in-sql/
  const query = `
      WITH server_insert AS (
        INSERT INTO servers(server_id, server_drops) 
        VALUES($1, $5) 
        ON CONFLICT (server_id) DO NOTHING
      )
      INSERT INTO users(server_id, user_id, items, fishes) 
      VALUES($1, $2, $3, $4) 
      ON CONFLICT (server_id, user_id) DO NOTHING;
    `;

  // REMEBER TO ADD THIS TEXT FOR EVENTS!!!!
  /*
    INSERT INTO events(server_id, user_id) 
    VALUES($1, $2) ON CONFLICT (server_id, user_id) DO NOTHING;
  */

  const values = [serverId, userId, itemsJsonData, fishesJsonData, JSON.stringify(serverDropsJsonData)];

  await client.database.query(query, values); // we inserted new data!
};
