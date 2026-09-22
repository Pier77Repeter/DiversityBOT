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

  // empty, will be filled when users drops something
  const dropsJsonData = {};

  const serverDropsJsonData = [
    {
      id: "1",
      type: "item",
      name: "DiversityGem",
      desc: "A very rare role drop.",
      chance: 0.1,
    },
    {
      id: "2",
      type: "item",
      name: "Mystery Box",
      desc: "Contains unknown riches.",
      chance: 5.5,
    },
    {
      id: "3",
      type: "item",
      name: "Common Box",
      desc: "Contains basic supplies.",
      chance: 20.8,
    },
    {
      id: "4",
      type: "item",
      name: "Pocket Lint",
      desc: "Absolutely worthless, but you found it.",
      chance: 22.0,
    },
    {
      id: "5",
      type: "item",
      name: "Rusty Coin",
      desc: "An old coin from a forgotten era.",
      chance: 19.71,
    },
    {
      id: "6",
      type: "item",
      name: "Bronze Token",
      desc: "Can be traded for low-tier rewards.",
      chance: 15.0,
    },
    {
      id: "7",
      type: "item",
      name: "Silver Token",
      desc: "Can be traded for mid-tier rewards.",
      chance: 8.0,
    },
    {
      id: "8",
      type: "item",
      name: "Gold Token",
      desc: "Can be traded for high-tier rewards.",
      chance: 5.0,
    },
    {
      id: "9",
      type: "item",
      name: "Platinum Token",
      desc: "A highly sought-after currency.",
      chance: 2.0,
    },
    {
      id: "10",
      type: "role",
      name: "Lucky Citizen",
      desc: "A cosmetic role for finding this token.",
      chance: 1.0,
      roleId: "YOUR_ROLE_ID_HERE",
    },
    {
      id: "11",
      type: "item",
      name: "Magic Dust",
      desc: "Tingles to the touch.",
      chance: 0.5,
    },
    {
      id: "12",
      type: "item",
      name: "Glowing Shard",
      desc: "Emits a faint blue light.",
      chance: 0.2,
    },
    {
      id: "13",
      type: "item",
      name: "Void Fragment",
      desc: "It feels heavy, yet weighs nothing.",
      chance: 0.1,
    },
    {
      id: "14",
      type: "item",
      name: "Celestial Essence",
      desc: "A bottled piece of a fallen star.",
      chance: 0.05,
    },
    {
      id: "15",
      type: "role",
      name: "Chosen One",
      desc: "An extremely rare role.",
      chance: 0.02,
      roleId: "YOUR_ROLE_ID_HERE",
    },
    {
      id: "16",
      type: "item",
      name: "Godly Blessing",
      desc: "You feel an immense surge of power.",
      chance: 0.01,
    },
    {
      id: "17",
      type: "item",
      name: "Developer's Tear",
      desc: "Shed during a late-night debugging session.",
      chance: 0.005,
    },
    {
      id: "18",
      type: "item",
      name: "Glitch Entity",
      desc: "MissingNo has entered the chat.",
      chance: 0.004,
    },
    {
      id: "19",
      type: "item",
      name: "Universal Seed",
      desc: "The building block of a new reality.",
      chance: 0.0009,
    },
    {
      id: "20",
      type: "item",
      name: "The Absolute Nothingness",
      desc: "True RNG perfection. You defied all odds.",
      chance: 0.0001,
    },
  ];

  // try to insert this row, if the primary key already exists, just ignore it and move on, only inserting users who actually use the bot
  // LOOK AT https://www.geeksforgeeks.org/sql/cte-in-sql/
  const query = `
      WITH server_insert AS (
        INSERT INTO servers(server_id, server_drops) 
        VALUES($1, $6) 
        ON CONFLICT (server_id) DO NOTHING
      )
      INSERT INTO users(server_id, user_id, items, fishes, found_drops) 
      VALUES($1, $2, $3, $4, $5) 
      ON CONFLICT (server_id, user_id) DO NOTHING;
    `;

  // REMEBER TO ADD THIS TEXT FOR EVENTS!!!!
  /*
    INSERT INTO events(server_id, user_id) 
    VALUES($1, $2) ON CONFLICT (server_id, user_id) DO NOTHING;
  */

  const values = [serverId, userId, itemsJsonData, fishesJsonData, dropsJsonData, JSON.stringify(serverDropsJsonData)];

  await client.database.query(query, values); // we inserted new data!
};
