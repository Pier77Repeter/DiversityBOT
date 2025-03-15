const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { token, botId } = require("./config.json");
const { get } = require("http");
const sqlite3 = require("sqlite3").verbose();

// needed in index.js for bot status
var isBotRestarting = false;

// output shit
const logPrefix = "[Loader]:";

module.exports = {
  initLoader: async (client) => {
    // loading the database
    console.log(logPrefix, "Loading the database...");
    const dbPath = path.join(__dirname, "database.db");
    client.database = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error(logPrefix, "Error opening database:", err.message);
          process.exit(1); // brute force exiting, bc if no db no bot
        } else {
          resolve(db);
        }
      });
    });
    await new Promise((resolve, reject) => {
      client.database.serialize(function () {
        client.database.run(
          "CREATE TABLE IF NOT EXISTS Server (serverId VARCHAR(20) NOT NULL PRIMARY KEY, modCmd BOOLEAN, musiCmd BOOLEAN, eventCmd BOOLEAN, communityCmd BOOLEAN);",
          (err) => {
            if (err) {
              console.error(logPrefix, "Error building database in 'Server' table:", err);
              return reject(err);
            }
          }
        );

        client.database.run(
          "CREATE TABLE IF NOT EXISTS Channel (channelId VARCHAR(20) NOT NULL PRIMARY KEY, snipedMessage TEXT, snipedMessageAuthorId VARCHAR(20) NOT NULL, serverId VARCHAR(20) NOT NULL, FOREIGN KEY(serverId) REFERENCES Server(serverId));",
          (err) => {
            if (err) {
              console.error(logPrefix, "Error building database in 'Channel' table:", err);
              return reject(err);
            }
          }
        );

        client.database.run(
          "CREATE TABLE IF NOT EXISTS User (serverId VARCHAR(20) NOT NULL, userId VARCHAR(20) NOT NULL, reputation INT, xp INT, nextXp INT, level INT, money BIGINT, bankMoney BIGINT, totalMoney BIGINT, items TEXT, fishes TEXT, hasPet BOOLEAN, petHealthCooldown INT, petFunCooldown INT, petHungerCooldown INT, petThirstCooldown INT, petVetCooldown INT, petPlayCooldown INT, petFeedCooldown INT, petDrinkCooldown INT, warns INT, memeCooldown INT, nukeCooldown INT, battleCooldown INT, hackCooldown INT, hmCooldown INT, jmCooldown INT, scTestCooldown INT, cannyCooldown INT, uncannyCooldown INT, xpLeaderboardCooldown INT, leaderboardCooldown INT, robCooldown INT, dailyCooldown INT, dupeCooldown INT, mineCooldown INT, huntCooldown INT, crimeCooldown INT, searchCooldown INT, begCooldown INT, highLowCooldown INT, postVideoCooldown INT, postMemeCooldown INT, rouletteCooldown INT, workCooldown INT, fishCooldown INT, imageCooldown INT, PRIMARY KEY (serverId, userId));",
          (err) => {
            if (err) {
              console.error(logPrefix, "Error building database in 'User' table:", err);
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
    console.log(logPrefix, "SQLite database is ready");

    // loading events
    console.log(logPrefix, "Loading events...");
    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      try {
        const event = require(path.join(eventsPath, file));
        if (typeof event === "function") {
          // passing the Discord client to the event function
          event(client);
        } else if (typeof event.once === "function" && typeof event.execute === "function") {
          if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
          } else {
            client.on(event.name, (...args) => event.execute(...args, client));
          }
        } else {
          console.error(logPrefix, "Invalid event file: " + file + " missing: 'client.on' or 'client.once'");
        }
      } catch (error) {
        console.error(logPrefix, "Error loading event " + file + ":", error);
      }
    }

    // loading commands
    console.log(logPrefix, "Loading commands...");
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
          } else {
            console.error(logPrefix, "Invalid command file: " + file + " missing required 'name' and 'execute' property");
          }
        } catch (error) {
          console.error(logPrefix, "Error loading command " + file + ":", error);
        }
      }
    }

    // loading slash commands
    console.log(logPrefix, "Loading slash commands...");
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
          console.error(logPrefix, "Invalid slash command file: " + filePath + " missing 'data' and 'execute' property");
        }
      } catch (error) {
        console.error(logPrefix, "Error loading slash command " + file + ":", error);
      }
    }

    // registering slash commands using the REST API V10
    const rest = new REST({ version: "10" }).setToken(token);

    try {
      console.log(logPrefix, "Registering slash commands...");

      // this is for global commands
      await rest.put(Routes.applicationCommands(botId), { body: slashCommands });
    } catch (error) {
      console.error(logPrefix, error);
    }
  },
  shutdownLoader: async (client) => {
    isBotRestarting = true;
    console.log(logPrefix, "Initiating Bot shutdown...");

    client.destroy();
    console.log(logPrefix, "1/2 - Client now offline");

    await new Promise((resolve, reject) => {
      database.close((err) => {
        if (err) {
          console.error(logPrefix, "Error closing the database:", err.message);
          reject(err);
        } else {
          console.log(logPrefix, "2/2 - Ended database connection");
          resolve();
        }
      });
    });

    console.log(logPrefix, "Shutdown completed, terminating process");
    process.exit(0);
  },
  getRestartStatus: () => isBotRestarting,
};
