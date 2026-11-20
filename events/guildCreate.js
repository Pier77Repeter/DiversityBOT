const { Events } = require("discord.js");
const logger = require("../logger")("GuildCreate");

module.exports = (client) => {
  client.on(Events.GuildCreate, async (guild) => {
    // creating a set of default drops
    const serverDropsJsonData = [
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

    // yay new server!
    await client.database.query("INSERT INTO servers(server_id, server_drops) VALUES($1, $2)", [guild.id, JSON.stringify(serverDropsJsonData)]).catch((error) => {
      logger.error(`Error while INSERTING data in db: Server '${guild.id}'`, error);
    });
  });
};
