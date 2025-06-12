/*
Author: Pier77Repeter
Project started on: 21 August 2021
Copyright: DiversityBOT© 2021-2025
Notes: This is the rewrite of the DiversityBOT, completly from 0. The biggest project i've ever did!
*/

// init log
const logPrefix = "[Main]:";
const logErrPrefix = "[Main/ERROR]:";
console.log(logPrefix, "Initializing DiversityBOT...");

// checking config.json
console.log(logPrefix, "Checking Bot configuration...");
const fs = require("fs");
const path = require("path");

const configFilePath = path.join(__dirname, "config.json");

// you can make your own custom configurations, didn't want to put itemPrices in db
const defaultConfigs = {
  botToken: "YOUR_BOT_TOKEN_HERE",
  botId: "YOUR_BOT_ID_HERE",
  itemPrices: {
    diversityGemPrice: 1000000,
    bitcoinPrice: 80000,
    dogecoinPrice: 100,
    gunPrice: 3000,
    ak47Price: 7000,
    fishingRodPrice: 500,
    bananaPrice: 200,
    beansPrice: 400,
    holyPooPrice: 1000,
    moacoinPrice: 500,
    divcoinPrice: 10000,
    kar98kPrice: 5000,
    pickaxePrice: 700,
  },
  fishPrices: {
    fishPrice: 10,
    tropicalFishPrice: 20,
    pufferFishPrice: 25,
    shrimpPrice: 20,
    lobsterPrice: 70,
    crabPrice: 100,
    squidPrice: 30,
    octopusPrice: 25,
    sharkPrice: 15,
    whalePrice: 300,
  },
};

// checks if config.json exists
if (fs.existsSync(configFilePath)) {
  try {
    // parse it in case you messed something up
    const configFileContent = fs.readFileSync(configFilePath, "utf8");
    JSON.parse(configFileContent);
  } catch (error) {
    console.error(logErrPrefix, "Error parsing 'config.json': " + error);
    process.exit(1);
  }
} else {
  // first time running the bot, creating the file
  console.log(logPrefix, "Creating 'config.json' with default configurations...");
  try {
    const configString = JSON.stringify(defaultConfigs, null, 2);
    fs.writeFileSync(configFilePath, configString, "utf8");

    const configFileContent = fs.readFileSync(configFilePath, "utf8");
    JSON.parse(configFileContent);
  } catch (error) {
    console.error(logErrPrefix, "Error creating or parsing 'config.json': " + error);
    process.exit(1);
  }
}

// error handler to prevent crashes, we put this here because config.json is like very important, more than the database
process.on("uncaughtException", function (err) {
  console.warn("\n[Error handler]: CRASH PREVENTED, PLEASE LOOK AT THE ERROR!!!");
  console.warn("=============================================================");
  console.error(err);
  console.warn("=============================================================");
  console.warn("[Error handler]: CRASH PREVENTED, PLEASE LOOK AT THE ERROR!!!\n");
});

// imports for necessary discord.js classes
const { Client, Events, GatewayIntentBits, ActivityType } = require("discord.js");
const { botToken } = require("./config.json");
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
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// bot status setup
var botStatus = [
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

// keep alive the bot while it loads, start the web server
const keepAlive = require("./server");
keepAlive();

// bot logging in
client
  .login(botToken)
  .then(() => {
    // AFTER the bot logged in THEN we can start load the whole thing
    loader.initLoader(client);
  })
  .catch((error) => {
    console.error(logErrPrefix, "Failed to log into Discord: " + error);
    process.exit(1);
  });

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
