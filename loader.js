const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { Player } = require("discord-player");
const { SoundCloudExtractor } = require("@discord-player/extractor");
const sqlite3 = require("sqlite3").verbose();
const logger = require("./logger")("Loader");
const { botToken, botId } = require("./config.json");
const delay = require("./utils/delay");

// needed in index.js and messageCreate.js,
var isBotRestarting = false;

module.exports = {
  initLoader: async (client) => {
    // loading the database
    logger.info("Loading the database...");
    const dbPath = path.join(__dirname, "database.db");

    // using SQLite3, take a look here: https://github.com/TryGhost/node-sqlite3/wiki
    client.database = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          logger.error("Error opening the database", err);
          process.exit(1); // brute force exiting, bc if no db no bot
        } else {
          resolve(db);
        }
      });
    });
    await new Promise((resolve, reject) => {
      client.database.serialize(function () {
        client.database.run(
          "CREATE TABLE IF NOT EXISTS Server (serverId VARCHAR(20) NOT NULL PRIMARY KEY, modCmd BOOLEAN, musiCmd BOOLEAN, eventCmd BOOLEAN, communityCmd BOOLEAN, modLogChannel VARCHAR(20), playCooldown INT, imageCooldown INT, hmCooldown INT, jmCooldown INT, cannyCooldown INT, uncannyCooldown INT);",
          (err) => {
            if (err) {
              logger.error("Error building database in 'Server' table", err);
              return reject(err);
            }
          }
        );

        client.database.run(
          "CREATE TABLE IF NOT EXISTS Channel (channelId VARCHAR(20) NOT NULL PRIMARY KEY, snipedMessage TEXT, snipedMessageAuthorId VARCHAR(20) NOT NULL, serverId VARCHAR(20) NOT NULL, FOREIGN KEY(serverId) REFERENCES Server(serverId) ON DELETE CASCADE);",
          (err) => {
            if (err) {
              logger.error("Error building database in 'Channel' table", err);
              return reject(err);
            }
          }
        );

        client.database.run(
          "CREATE TABLE IF NOT EXISTS User (serverId VARCHAR(20) NOT NULL, userId VARCHAR(20) NOT NULL, level INT, xp INT, nextXp INT, reputation INT, socialCredits INT, warns INT, money BIGINT, bankMoney BIGINT, debts INT, debtsCooldown INT, items TEXT, fishes TEXT, jobType VARCHAR(20), hasPet BOOLEAN, petId VARCHAR(20), petStatsHealth INT, petStatsFun INT, petStatsHunger INT, petStatsThirst INT, petCooldown INT, petVetCooldown INT, petPlayCooldown INT, petFeedCooldown INT, petDrinkCooldown INT, battleCooldown INT, begCooldown INT, crimeCooldown INT, dailyCooldown INT, dupeCooldown INT, fishCooldown INT, hackCooldown INT, highLowCooldown INT, huntCooldown INT, memeCooldown INT, mineCooldown INT, nukeCooldown INT, postMemeCooldown INT, postVideoCooldown INT, robCooldown INT, rouletteCooldown INT, scTestCooldown INT, searchCooldown INT, workCooldown INT, PRIMARY KEY (serverId, userId), FOREIGN KEY(serverId) REFERENCES Server(serverId) ON DELETE CASCADE);",
          (err) => {
            if (err) {
              logger.error("Error building database in 'User' table", err);
              return reject(err);
            }
          }
        );

        /*
        Note: This is useless at the moment, it will be used when Christmas
        client.database.run(
          "CREATE TABLE IF NOT EXISTS EventsUser (userId VARCHAR(20) NOT NULL PRIMARY KEY, treeLevel INT, twigs INT, leaves INT, goldenCoins INT, decoid1 BOOLEAN, decoid2 BOOLEAN, decoid3 BOOLEAN, decoid4 BOOLEAN);",
          (err) => {
            if (err) {
              console.error(logPrefix, "Error building database (creating Event user table)");
              return reject(err);
            }
          }
        );
        */

        resolve();
      });
    });

    // creating discord player
    try {
      client.player = new Player(client);
      await client.player.extractors.register(SoundCloudExtractor); // we only use this because can't use YouTube, against ToS
      logger.info("Music player operational");
    } catch (error) {
      logger.error("Error registring 'SoundCloudExtractor' as player extractor", error);
    }

    // loading events
    logger.info("Loading events...");
    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      try {
        const event = require(path.join(eventsPath, file));
        if (typeof event === "function") {
          // passing the Discord client to the event function
          event(client);
        } else {
          logger.warn("Invalid event file: " + file + ", expected 'module.exports' to be a function");
        }
      } catch (error) {
        logger.error("Error loading event " + file, error);
      }
    }

    // loading commands
    logger.info("Loading message commands...");
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, "commands");
    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(path.join(commandsPath, folder)).filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        try {
          const command = require(path.join(commandsPath, folder, file));
          if (typeof command.name === "string" && typeof command.execute === "function") {
            // adding the commands to the collection
            client.commands.set(command.name, command);

            // adding aliases if they exist (in commands file they are represented as 'aliases: ["pang", "pong"]')
            if (command.aliases && Array.isArray(command.aliases)) {
              command.aliases.forEach((alias) => {
                if (typeof alias === "string") {
                  client.commands.set(alias, command);
                } else {
                  logger.warn("Invalid alias '" + alias + "' in command file: " + file);
                }
              });
            }
          } else {
            logger.warn("Invalid command file: " + file + " missing required 'name' and 'execute' property");
          }
        } catch (error) {
          logger.error("Error loading command " + file, error);
        }
      }
    }

    // loading slash commands
    logger.info("Loading slash commands...");
    client.slashCommands = new Collection();
    const slashCommands = [];
    const slashCommandsPath = path.join(__dirname, "commands-slash");
    const commandFiles = fs.readdirSync(slashCommandsPath).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      try {
        const filePath = path.join(slashCommandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
          client.slashCommands.set(command.data.name, command);
          // push the JSON representation of the slash command to the array
          slashCommands.push(command.data.toJSON());
        } else {
          logger.warn("Invalid slash command file: " + filePath + " missing 'data' and 'execute' property");
        }
      } catch (error) {
        logger.error("Error loading slash command " + file, error);
      }
    }

    // registering slash commands using the REST API V10
    const rest = new REST({ version: "10" }).setToken(botToken);

    try {
      logger.info("Registering slash commands...");

      // this is for global commands
      await rest.put(Routes.applicationCommands(botId), { body: slashCommands });
    } catch (error) {
      logger.error("Failed to register slash commands", error);
    }
  },
  shutdownLoader: async (client) => {
    isBotRestarting = true;
    logger.info("Initiating Bot shutdown...");
    await delay(5000); // a bit of delay for completing unfinished tasks

    client.destroy();
    logger.info("1/2 - Client now offline");

    await new Promise((resolve, reject) => {
      client.database.close((err) => {
        if (err) {
          logger.error("Error closing the database", err);
          reject(err);
        } else {
          logger.info("2/2 - Ended database connection");
          resolve();
        }
      });
    });

    logger.info("Shutdown completed, terminating process");
    process.exit(0);
  },
  getRestartStatus: () => isBotRestarting,
  setRestartStatus: (status) => (isBotRestarting = status),
};
