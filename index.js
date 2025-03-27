/*
Author: Pier77Repeter
Project started on: 21 August 2021
Copyright: DiversityBOT© 2021-2025
Notes: This is the rewrite of the DiversityBOT, completly from 0. The biggest project i've ever did!
*/

// init log
const logPrefix = "[Main]:";
console.log(logPrefix, "Initializing DiversityBOT...");

// error handler to prevent crashes
process.on("uncaughtException", function (err) {
  console.warn("\n[Error handler]: CRASH PREVENTED, PLEASE LOOK AT THE ERROR!!!");
  console.warn("=============================================================");
  console.error(err);
  console.warn("=============================================================");
  console.warn("[Error handler]: CRASH PREVENTED, PLEASE LOOK AT THE ERROR!!!\n");
});

// imports for necessary discord.js classes
const { Client, Events, GatewayIntentBits, ActivityType } = require("discord.js");
const { token } = require("./config.json");
const loader = require("./loader");
const listsGetRandomItem = require("./utils/listsGetRandomItem");

// variables
var botStatusIndex = 0;

// creating Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// starting up the loader
loader.initLoader(client);

// bot status setup
let botStatus = [
  { name: "DiversityCraft", type: ActivityType.Playing },
  { name: client.guilds.cache.size + " servers!", type: ActivityType.Watching },
  { name: "Version 2.0??? WOW!!!", type: ActivityType.Playing },
  // { name: "It's Christmas season boyz 🎅🎄", type: ActivityType.Playing },
  {
    name: listsGetRandomItem(
      [
        "Still debugging!",
        "Daily lag :i",
        "hello",
        "i'm online rn",
        "Pier77Repeter is Bob's best friend",
        "game",
        "d!help",
        "Now with slash commands!",
        "every day is a great day!",
        "/help",
        "Now with daily crashes!",
        "bye",
        "after all, why not",
        "Do you want some music? d!play!",
        "default text",
        ">DiversityCraft on top",
        "Since 2014!",
        "Not a normal bot",
        "d!ag exists for a reason :>",
        "bottom text",
        "Hey look, this is my status",
        "Did you join DiversityCraft yet? :/",
        "The perfect code, dosen't exist",
        "*randomly joins chat*",
        "Flipping trains on your area (╯°□°)╯︵ ┻━┻",
        "V2.0 took ages bruh",
      ],
      false
    ),
    type: ActivityType.Playing,
  },
];

// when the client is ready
client.once(Events.ClientReady, (readyClient) => {
  console.log(logPrefix, "DiversityBOT is ready, logged in as " + readyClient.user.tag);

  // bot status
  setInterval(() => {
    if (loader.getRestartStatus()) return;
    if (botStatusIndex === botStatus.length) botStatusIndex = 0;
    client.user.setActivity(botStatus[botStatusIndex]);
    botStatusIndex++;
  }, 300000);
});

// bot logging in
client.login(token);
