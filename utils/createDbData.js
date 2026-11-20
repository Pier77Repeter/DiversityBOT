const logger = require("../logger")("CreateDbData");

// used in messageCreate.js, interactionCreate.js, warn.js and /warn
module.exports = async function createDbData(client, serverId, userId) {
  // the json data has been redesigned, if quantity = 0 it's same as false
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
      type: "item",
      name: "THE UNKNOWN",
      desc: "This is breaks the fabric of reality itself, nobody knows what is this or what it does, but one thing is certain, you have been blessed by the RNG",
      chance: 0.00001,
    },
    {
      id: "2",
      type: "money",
      name: "💎 DiversityGem",
      desc: "The finest gem in all of Earth",
      chance: 0.001,
      money: 1000000,
    },
    {
      id: "3",
      type: "money",
      name: "🎟️ Lucky Lottery Ticket",
      desc: "The lottery ticket you always dream to win",
      chance: 0.03,
      money: 100000,
    },
    {
      id: "4",
      type: "money",
      name: "🪙 Golden Coin",
      desc: "It shines bright on the ground, waiting to be picked up",
      chance: 1,
      money: 500,
    },
    {
      id: "5",
      type: "item",
      name: "❓ Empty Role",
      desc: "Is this a role or something?",
      chance: 6,
    },
    {
      id: "6",
      type: "item",
      name: "🤪 Stupidity",
      desc: "Even the RNG itself thinks you are stupid",
      chance: 11,
    },
    {
      id: "7",
      type: "item",
      name: "🍎 Apple",
      desc: "An Apple just fell from the tree!",
      chance: 22,
    },
  ];

  // LOOK AT https://www.geeksforgeeks.org/sql/cte-in-sql/
  const query = `
      WITH inserted_server AS (
        INSERT INTO servers(server_id, server_drops)
        VALUES($1, $3)
        ON CONFLICT (server_id) DO NOTHING
        RETURNING server_id
      ),
      server_for_user_and_event AS (
        SELECT server_id FROM inserted_server
        UNION ALL
        SELECT server_id
        FROM servers
        WHERE server_id = $1
          AND NOT EXISTS (SELECT 1 FROM inserted_server)
      ),
      inserted_user AS (
        INSERT INTO users(server_id, user_id, items, fishes)
        SELECT server_id, $2, $4, $5
        FROM server_for_user_and_event
        ON CONFLICT (server_id, user_id) DO NOTHING
        RETURNING user_id
      ),
      inserted_user_event AS (
        INSERT INTO events(server_id, user_id)
        SELECT server_id, $2
        FROM server_for_user_and_event
        ON CONFLICT (server_id, user_id) DO NOTHING
        RETURNING user_id
      )
      SELECT
        (SELECT COUNT(*) FROM inserted_user) AS users_created,
        (SELECT COUNT(*) FROM inserted_user_event) AS event_rows_created;
    `;

  const values = [serverId, userId, JSON.stringify(serverDrops), JSON.stringify(items), JSON.stringify(fishes)];

  await client.database.query(query, values).catch((error) => {
    logger.error("Failed to create new server/user/event data in db", error);
  });
};
