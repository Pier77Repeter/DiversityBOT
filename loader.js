const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { Player } = require("discord-player");
const { SoundCloudExtractor } = require("@discord-player/extractor");
const { Pool } = require("pg");
const logger = require("./logger")("Loader");
const { botToken, botId, dbUrl } = require("./config.json");
const delay = require("./utils/delay");

// needed in index.js, messageCreate.js and maybe somewhere else
let isBotRestarting = false;

module.exports = {
  initLoader: async (client) => {
    // loadig the postgres database
    logger.info("Loading the database...");

    try {
      const dbPool = new Pool({
        connectionString: dbUrl,
      });

      const dbClient = await dbPool.connect();

      try {
        // that's a lot of colums
        const setupQueries = `
        CREATE TABLE IF NOT EXISTS servers (
          server_id VARCHAR(20) NOT NULL PRIMARY KEY,
          mod_cmd BOOLEAN DEFAULT true,
          music_cmd BOOLEAN DEFAULT true,
          event_cmd BOOLEAN DEFAULT true,
          community_cmd BOOLEAN DEFAULT true,
          leveling_cmd BOOLEAN DEFAULT true,
          mod_log_channel VARCHAR(20),
          play_cooldown BIGINT DEFAULT 0,
          image_cooldown BIGINT DEFAULT 0,
          hm_cooldown BIGINT DEFAULT 0,
          jm_cooldown BIGINT DEFAULT 0,
          canny_cooldown BIGINT DEFAULT 0,
          uncanny_cooldown BIGINT DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS channels (
          channel_id VARCHAR(20) NOT NULL PRIMARY KEY,
          sniped_message TEXT,
          sniped_message_author_id VARCHAR(20) NOT NULL,
          server_id VARCHAR(20) NOT NULL,
          CONSTRAINT fk_server
              FOREIGN KEY(server_id) 
              REFERENCES servers(server_id) 
              ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS users (
          server_id VARCHAR(20) NOT NULL,
          user_id VARCHAR(20) NOT NULL,
          level INT DEFAULT 0,
          xp INT DEFAULT 0,
          next_xp INT DEFAULT 0,
          reputation INT DEFAULT 0,
          social_credits INT DEFAULT 0,
          warns INT DEFAULT 0,
          money BIGINT DEFAULT 0,
          bank_money BIGINT DEFAULT 0,
          debts BIGINT DEFAULT 0,
          debts_cooldown BIGINT DEFAULT 0,
          items JSONB DEFAULT '[]'::jsonb,
          fishes JSONB DEFAULT '[]'::jsonb,
          job_type VARCHAR(20),
          has_pet BOOLEAN DEFAULT false,
          pet_id VARCHAR(20),
          pet_stats_health INT DEFAULT 0,
          pet_stats_fun INT DEFAULT 0,
          pet_stats_hunger INT DEFAULT 0,
          pet_stats_thirst INT DEFAULT 0,
          pet_cooldown BIGINT DEFAULT 0,
          pet_vet_cooldown BIGINT DEFAULT 0,
          pet_play_cooldown BIGINT DEFAULT 0,
          pet_feed_cooldown BIGINT DEFAULT 0,
          pet_drink_cooldown BIGINT DEFAULT 0,
          battle_cooldown BIGINT DEFAULT 0,
          beg_cooldown BIGINT DEFAULT 0,
          crime_cooldown BIGINT DEFAULT 0,
          daily_cooldown BIGINT DEFAULT 0,
          dupe_cooldown BIGINT DEFAULT 0,
          fish_cooldown BIGINT DEFAULT 0,
          hack_cooldown BIGINT DEFAULT 0,
          high_low_cooldown BIGINT DEFAULT 0,
          hunt_cooldown BIGINT DEFAULT 0,
          meme_cooldown BIGINT DEFAULT 0,
          mine_cooldown BIGINT DEFAULT 0,
          nuke_cooldown BIGINT DEFAULT 0,
          post_meme_cooldown BIGINT DEFAULT 0,
          post_video_cooldown BIGINT DEFAULT 0,
          rob_cooldown BIGINT DEFAULT 0,
          roulette_cooldown BIGINT DEFAULT 0,
          sc_test_cooldown BIGINT DEFAULT 0,
          search_cooldown BIGINT DEFAULT 0,
          work_cooldown BIGINT DEFAULT 0,
          PRIMARY KEY (server_id, user_id),
          CONSTRAINT fk_server_user
              FOREIGN KEY(server_id) 
              REFERENCES servers(server_id) 
              ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
        CREATE INDEX IF NOT EXISTS idx_channels_server_id ON channels(server_id);
        `;

        await dbClient.query("BEGIN");
        await dbClient.query(setupQueries);
        await dbClient.query("COMMIT");
      } catch (error) {
        await dbClient.query("ROLLBACK");
        logger.error("Failed to setup the database", error);
        process.exit(1); // brute force exiting no DB, no bot.
      } finally {
        dbClient.release();
      }

      client.database = dbPool;
      logger.info("Database connected and ready :D");
    } catch (error) {
      logger.error("Failed to connect to the database", error);
      process.exit(1); // brute force exiting no DB, no bot.
    }

    // MOVING AWAY FROM SQLITE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    /*
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

    // valid only for the first time or when Channel/Event table gets dropped
    await new Promise((resolve, reject) => {
      client.database.serialize(() => {
        client.database.run(
          "CREATE TABLE IF NOT EXISTS Server (serverId VARCHAR(20) NOT NULL PRIMARY KEY, modCmd BOOLEAN, musiCmd BOOLEAN, eventCmd BOOLEAN, communityCmd BOOLEAN, levelingCmd BOOLEAN, modLogChannel VARCHAR(20), playCooldown INT, imageCooldown INT, hmCooldown INT, jmCooldown INT, cannyCooldown INT, uncannyCooldown INT);",
          (err) => {
            if (err) {
              logger.error("Error building database in 'Server' table", err);
              process.exit(1); // of course, we can't continue
            }
          }
        );

        client.database.run(
          "CREATE TABLE IF NOT EXISTS Channel (channelId VARCHAR(20) NOT NULL PRIMARY KEY, snipedMessage TEXT, snipedMessageAuthorId VARCHAR(20) NOT NULL, serverId VARCHAR(20) NOT NULL, FOREIGN KEY(serverId) REFERENCES Server(serverId) ON DELETE CASCADE);",
          (err) => {
            if (err) {
              logger.error("Error building database in 'Channel' table", err);
              process.exit(1);
            }
          }
        );

        client.database.run(
          "CREATE TABLE IF NOT EXISTS User (serverId VARCHAR(20) NOT NULL, userId VARCHAR(20) NOT NULL, level INT, xp INT, nextXp INT, reputation INT, socialCredits INT, warns INT, money BIGINT, bankMoney BIGINT, debts INT, debtsCooldown INT, items TEXT, fishes TEXT, jobType VARCHAR(20), hasPet BOOLEAN, petId VARCHAR(20), petStatsHealth INT, petStatsFun INT, petStatsHunger INT, petStatsThirst INT, petCooldown INT, petVetCooldown INT, petPlayCooldown INT, petFeedCooldown INT, petDrinkCooldown INT, battleCooldown INT, begCooldown INT, crimeCooldown INT, dailyCooldown INT, dupeCooldown INT, fishCooldown INT, hackCooldown INT, highLowCooldown INT, huntCooldown INT, memeCooldown INT, mineCooldown INT, nukeCooldown INT, postMemeCooldown INT, postVideoCooldown INT, robCooldown INT, rouletteCooldown INT, scTestCooldown INT, searchCooldown INT, workCooldown INT, PRIMARY KEY (serverId, userId), FOREIGN KEY(serverId) REFERENCES Server(serverId) ON DELETE CASCADE);",
          (err) => {
            if (err) {
              logger.error("Error building database in 'User' table", err);
              process.exit(1);
            }
          }
        );

        client.database.run(
          "CREATE TABLE IF NOT EXISTS Event (serverId VARCHAR(20) NOT NULL, userId VARCHAR(20) NOT NULL, treeLevel INT, twigs INT, leaves INT, goldenCoins INT, decoId1 BOOLEAN, decoId2 BOOLEAN, decoId3 BOOLEAN, decoId4 BOOLEAN, forestCooldown INT, helpsantaCooldown INT, PRIMARY KEY (serverId, userId), FOREIGN KEY(serverId) REFERENCES Server(serverId) ON DELETE CASCADE);",
          (err) => {
            if (err) {
              logger.error("Error building database in 'Event' table", err);
              process.exit(1);
            }
          }
        );

        resolve();
      });
    });
    */

    // creating discord player (needs a bit of rework)
    try {
      client.player = new Player(client);
      await client.player.extractors.register(SoundCloudExtractor); // <-- this is actually shit, moving away from this
      logger.info("Music player operational :P");
    } catch (error) {
      logger.error("Error registring music player extractor", error);
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
    await delay(10000); // a bit of delay for completing unfinished tasks

    await client.destroy();
    logger.info("1/2 - Client now offline");

    try {
      await client.database.end();
      logger.info("2/2 - Ended database connection");
    } catch (error) {
      logger.error("Error closing the database connection nicely", error);
    }

    logger.info("Shutdown completed, terminating process");
    process.exit(0);
  },
  // needed in 'd!restart' and restart checking
  getRestartStatus: () => isBotRestarting,
  setRestartStatus: (status) => (isBotRestarting = status),
};
