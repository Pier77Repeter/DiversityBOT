# DiversityBOT v2.0

Yay, this is the complete rewrite of the Bot, still a work in progress (it's gonna take so much time :pain:)

## Installation

1.  **Install Node.js:**

    - Ensure you have the latest (LTS) version of Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

2.  **Clone the repository:**

    - Clone this repository to your local machine using Git:
      ```bash
      git clone --single-branch --branch dev DiversityBOT
      cd DiversityBOT
      ```

3.  **Install dependencies:**

    - Navigate to the bot's directory and install the required dependencies using npm:
      ```bash
      npm install
      ```

4.  **Configuration:**

    - Create a `config.json` file in the root directory of the project.
    - After that, copy and paste this, and change "YOUR_BOT_TOKEN_HERE" to your bot token and "YOUR_BOT_ID_HERE" to your bot id

      ```json
      {
        "token": "YOUR_BOT_TOKEN_HERE",
        "botId": "YOUR_BOT_ID_HERE"
      }
      ```

5.  **Run the Bot:**
    - Start the bot by running:
      ```bash
      node index.js
      ```

## Documentation

### PROVIDE FEEDBACK IF THIS DOCUMENTATION IS EASY AND UNDERSTANDABLE

- If you want to understand how the bot works, well here it is, hopefully it is understandable. There are comments in the code when and where it gets complicated. Suggestions before reading the commands? Start from `commands/templates/ping.js` or for slash commands `commands-slash/help.js`. Also read: [Discord.JS docs](https://discord.js.org/docs/packages/discord.js/14.18.0) AND [Discord Player docs](https://discord-player.js.org/)

### Core Files

- **`index.js`**:

  - This is the **main entry point** of the Discord bot application.
  - Its primary responsibilities include:
    - Logging the bot into Discord using its token.
    - Initiating the bot's core functionality, often by starting the `loader.js`.

- **`loader.js`**:

  - This file is responsible for **loading and initializing various components** of the bot.
  - It typically handles:
    - Reading and registering commands (both message-based and slash commands).
    - Loading and attaching event listeners.
    - **Exclusion:** Files located within the `utils` folder are generally _not_ loaded by this file.
  - In order, the _loader loads_:
    - database with **SQLite3**
    - discord player using **discord player**
    - events
    - commands
    - slash commands
    - registers the slash commands

- **`config.json`**:

  - This file **must be created manually**, read the configuration above the documentation.
  - At the moment it's needed to store:
    - The bot token for logging into Discord
    - The bot id to register the slash commands

### Directories

- **`commands/`**:

  - This directory contains all the **message-based commands** for the bot.
  - These commands are typically triggered by the specific prefix `D!` followed by the command name.
  - Each file within this directory represents a single command.

- **`commands-slash/`**:

  - This directory houses all the **slash commands** (application commands) for the bot.
  - These commands are accessed using the `/` prefix in Discord and offer a more structured and interactive way for users to interact with the bot.
  - Similar to the `commands` directory, each file often defines a single slash command.

- **`events/`**:

  - This directory contains all the **event handlers** for the bot.
  - Events represent actions that occur within Discord. Common examples include:

    - `guildCreate` / `guildDelete`: When the bot joins or leaves a server.
    - `messageCreate`: When a new message is sent in a text channel.

    - Each file in this directory handles one related Discord event.

  - **Note:** `ready` is located inside `index.js`.

- **`media/`**:

  - This directory stores all the **local media assets** used by the bot.
  - This can include images, GIFs, or other files that the bot might send or embed in messages.

- **`utils/`**:

  - This directory contains a collection of **utility functions** that are used throughout the bot's code.
  - These functions are designed to be reusable and perform common tasks, such as:
    - Mathematical operations.
    - Cooldown management.
  - **Note:** Files within this folder are loaded and used by other parts of the bot (commands, events, etc.) but are _not_ directly loaded as commands or events by the `loader.js`.

## Contributing

- You can contribute to the project by, submiting pull requests OR the best thing to do, is to invite the bot to your Discord server and find any bugs, bot invite link: [here](https://discord.com/api/oauth2/authorize?client_id=878594739744673863&permissions=2080948874566&scope=bot)
- After inviting the bot, make sure it has all the needed permissions

## License

This project is licensed under my own license. See the `LICENSE.md` file for more information.

## Support

- Join the Discord server: [here](https://discord.gg/KxadTdz) and follow me on all of my socials: [here](https://www.youtube.com/@pier77repeter)

## Credits

- Myself and definitely.not.adi for testing
