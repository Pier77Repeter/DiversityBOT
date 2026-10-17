const logger = require("../logger")("CreateDbData");

// used in messageCreate.js, interactionCreate.js, warn.js and /warn
module.exports = async function createDbData(client, serverId, userId) {
  // the json data has been redesigned, if quantity = 0 its same as false
  const items = [
    { id: "1", quantity: 0 },
    { id: "2", quantity: 0 },
    { id: "3", quantity: 0 },
    { id: "4", quantity: 0 },
    { id: "5", quantity: 0 },
    { id: "6", quantity: 0 },
    { id: "7", quantity: 0 },
    { id: "8", quantity: 0 },
    { id: "9", quantity: 0 },
    { id: "10", quantity: 0 },
    { id: "11", quantity: 0 },
    { id: "12", quantity: 0 },
    { id: "13", quantity: 0 },
  ];

  const fishes = [
    { id: "1", quantity: 0 },
    { id: "2", quantity: 0 },
    { id: "3", quantity: 0 },
    { id: "4", quantity: 0 },
    { id: "5", quantity: 0 },
    { id: "6", quantity: 0 },
    { id: "7", quantity: 0 },
    { id: "8", quantity: 0 },
    { id: "9", quantity: 0 },
    { id: "10", quantity: 0 },
  ];

  const serverDrops = [
    {
      id: "1",
      type: "unknown",
      name: "THE UNKNOWN",
      desc: "This is breaks the fabric of reality itself, nobody knows what is this and what it does, but one thing is certain, you have been blessed by the RNG",
      chance: 0.00001,
    },
    {
      id: "2",
      type: "item",
      name: "DiversityGem",
      desc: "The finest gem in all of Earth",
      chance: 0.01,
    },
    {
      id: "3",
      type: "money",
      name: "Lucky Lottery Ticket",
      desc: "The lottery ticket you always dream to win",
      chance: 0.7,
      money: 1000000,
    },
    {
      id: "4",
      type: "role",
      name: "Special Golden",
      desc: "A secret version of the Golden role!",
      chance: 2,
      role_id: "784816759886577694",
    },
    {
      id: "5",
      type: "item",
      name: "Notch's Golden Apple",
      desc: "The uncraftable apple of Minecraft",
      chance: 7,
    },
    {
      id: "6",
      type: "money",
      name: "Money on the ground",
      desc: "Well i guess you can just take them for free",
      chance: 15,
      money: 10,
    },
    {
      id: "7",
      type: "role",
      name: "Stupidity",
      desc: "Even the RNG itself thinks you are stupid",
      chance: 36,
      role_id: "788002186273095730",
    },
  ];

  // try to insert this row, if the primary key already exists, just ignore it and move on, only inserting users who actually use the bot
  // LOOK AT https://www.geeksforgeeks.org/sql/cte-in-sql/
  const query = `
      WITH server_insert AS (
        INSERT INTO servers(server_id, server_drops) 
        VALUES($1, $3) 
        ON CONFLICT (server_id) DO NOTHING
      )
      INSERT INTO users(server_id, user_id, items, fishes) 
      VALUES($1, $2, $4, $5) 
      ON CONFLICT (server_id, user_id) DO NOTHING;
    `;

  // REMEBER TO ADD THIS TEXT FOR EVENTS!!!!
  /*
    INSERT INTO events(server_id, user_id) 
    VALUES($1, $2) ON CONFLICT (server_id, user_id) DO NOTHING;
  */

  const values = [serverId, userId, JSON.stringify(serverDrops), JSON.stringify(items), JSON.stringify(fishes)];

  // we insert new data!
  await client.database.query(query, values).catch((error) => {
    logger.error("Failed to create new server/user in db", error);
  });
};
