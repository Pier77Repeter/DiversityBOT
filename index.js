/*
Author: Pier77Repeter
Project started on: 21 August 2021
Copyright: DiversityBOT© 2021-2026
Notes: DiversityBOT is the biggest project i've ever made!
*/

// error handler to prevent crashes, top priority even tho position dosen't metter
process.on("uncaughtException", (error) => {
  console.warn("\n[Error handler]: CRASH PREVENTED, PLEASE LOOK AT THE ERROR!!!\n=============================================================");
  console.error(error);
  console.warn("=============================================================\n[Error handler]: CRASH PREVENTED, PLEASE LOOK AT THE ERROR!!!\n");
});

// init log
const logger = require("./logger")("Main"); // what is this JS feature? idk but you can pass parameter when you require()
logger.info("Initializing DiversityBOT...");

// checking config.json
const fs = require("fs");
const path = require("path");

const configFilePath = path.join(__dirname, "config.json");

// you can make your own custom configurations
const defaultConfigs = {
  botToken: "YOUR_BOT_TOKEN_HERE",
  botId: "YOUR_BOT_ID_HERE",
  dbUrl: "YOUR_POSTGRES_URL_HERE",
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
    logger.error("Error parsing 'config.json'", error);
    process.exit(1);
  }
} else {
  // first time running the bot, creating the file
  logger.info("Creating 'config.json' with default configurations...");
  try {
    const configString = JSON.stringify(defaultConfigs, null, 2);
    fs.writeFileSync(configFilePath, configString, "utf8");

    const configFileContent = fs.readFileSync(configFilePath, "utf8");
    JSON.parse(configFileContent);
  } catch (error) {
    logger.error("Error creating or parsing 'config.json'", error);
    process.exit(1);
  }
}

// imports for necessary discord.js classes
const { Client, Events, GatewayIntentBits, ActivityType } = require("discord.js");
const { botToken } = require("./config.json");
const loader = require("./loader");
const listsGetRandomItem = require("./utils/listsGetRandomItem");

// web server is needed to keep the bot online
const keepAlive = require("./server");
keepAlive();

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

// AFTER the bot fully loaded THEN we can log in
loader.initLoader(client).then(async () => {
  await client.login(botToken).catch((error) => {
    logger.error("Failed to log into Discord", error);
    process.exit(1);
  });
});

// when the client is ready
client.once(Events.ClientReady, (readyClient) => {
  logger.info("DiversityBOT is ready, logged in as " + readyClient.user.tag);

  // bot status setup, client.guilds.cache.size returns the correct number AFTER the 'ready' event fires
  const botStatus = [
    { name: "DiversityCraft", type: ActivityType.Playing },
    { name: client.guilds.cache.size + " servers!", type: ActivityType.Watching },
    { name: "Version 2.0??? WOW!!!", type: ActivityType.Playing },
    //{ name: "It's Christmas season boyz 🎅🎄", type: ActivityType.Playing },
    {
      name: listsGetRandomItem(
        [
          "hello",
          "bye",
          "i'm online right now",
          "I'm currently gaming",
          "Hey look, this is my status",
          "*randomly joins the chat*",
          "HHEEEEELLLLLLLLLLOOOOOOOOOOOOO",
          "Every day is a great day!",
          "Daily lag :i",
          "Now with slash commands!",
          "Now with daily crashes!",
          "Still debugging!",
          "Is JavaScript real?",
          "The perfect code dosen't exist",
          "It's a string! No...it's a json object!",
          "I am free and open-source!",
          "V2.0 took ages bruh",
          "V6.9 has been released",
          "Not a normal bot",
          "A paranormal Discord Bot",
          "d!help",
          "/help",
          "Do you want some music? d!play!",
          "Imagine using d!meme to watch NSFW",
          "Pier77Repeter is Bob's best friend",
          ">DiversityCraft on top",
          "Did you join DiversityCraft yet? :/",
          "DiversityCraft is the coolest community!",
          "Since 2014!",
          "Online since 2021!",
          "default text",
          "top text",
          "bottom text",
          "Flipping trains on your area (╯°□°)╯︵ ┻━┻",
        ],
        false,
      ),
      type: ActivityType.Playing,
    },
  ];

  var botStatusIndex = 0;

  // bot status
  setInterval(() => {
    if (loader.getRestartStatus()) return; // if true stop updating else it will vomit an error when client is logged off but code still running
    if (botStatusIndex === botStatus.length) botStatusIndex = 0;
    client.user.setActivity(botStatus[botStatusIndex]);
    botStatusIndex++;
  }, 300000);
});
