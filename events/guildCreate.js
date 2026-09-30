const { Events } = require("discord.js");
const logger = require("../logger")("GuildCreate");

module.exports = (client) => {
  client.on(Events.GuildCreate, async (guild) => {
    // creating a set of default drops
    const serverDropsJsonData = [
      {
        id: 1,
        type: "item",
        name: "DiversityGem",
        desc: "The finest gem in all of Earth",
        chance: 0.01,
      },
      {
        id: 2,
        type: "money",
        name: "Lucky Lottery Ticket",
        desc: "The lottery ticket you always dream to win",
        chance: 0.7,
        money: 1000000,
      },
      {
        id: 3,
        type: "role",
        name: "Special Golden",
        desc: "A secret version of the Golden role!",
        chance: 2,
        role_id: "784816759886577694",
      },
      {
        id: 4,
        type: "item",
        name: "Notch's Golden Apple",
        desc: "The uncraftable apple of Minecraft",
        chance: 7,
      },
      {
        id: 5,
        type: "money",
        name: "Money on the ground",
        desc: "Well i guess you can just take them for free",
        chance: 15,
        money: 10,
      },
      {
        id: 6,
        type: "role",
        name: "Stupidity",
        desc: "Even the RNG itself thinks you are stupid",
        chance: 36,
        role_id: "788002186273095730",
      },
      {
        id: 7,
        type: "unknown",
        name: "THE UNKNOWN",
        desc: "This is breaks the fabric of reality itself, nobody knows what is this and what it does, but one thing is certain, you have been blessed by the RNG",
        chance: 0.00001,
      },
    ];

    // yay new server!
    await client.database.query("INSERT INTO servers(server_id, server_drops) VALUES($1, $2)", [guild.id, JSON.stringify(serverDropsJsonData)]).catch((error) => {
      logger.error(`Error while INSERTING data in db: Server '${guild.id}'`, error);
    });
  });
};
