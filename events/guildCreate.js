const { Events } = require("discord.js");
const logger = require("../logger")("GuildCreate");

module.exports = (client) => {
  client.on(Events.GuildCreate, async (guild) => {
    // creating a set of default drops
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

    // yay new server!
    await client.database.query("INSERT INTO servers(server_id, server_drops) VALUES($1, $2)", [guild.id, JSON.stringify(serverDropsJsonData)]).catch((error) => {
      logger.error("Error while INSERTING data in db: Server '" + guild.id + "'", error);
    });
  });
};
