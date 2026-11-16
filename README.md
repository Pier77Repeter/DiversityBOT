# DiversityBOT - Not a normal Discord Bot

This is the biggest coding project i've ever made! It all started as a dream i had about making a Discord Bot for my community (DiversityCraft), in the end i made come true!

## Requirements

- Node.js LTS (recommended: latest LTS) download it from [nodejs.org](https://nodejs.org/).
- Git [git-scm.com](https://git-scm.com/).
- A PostgreSQL database connection string
- A Discord bot token and application ID

## Installation

1. Clone the project:

   ```bash
   git clone https://github.com/Pier77Repeter/DiversityBOT.git
   cd DiversityBOT
   ```

   If you specifically want the development branch:

   ```bash
   git checkout dev
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the bot once so the default configuration file is created:

   ```bash
   node index.js
   ```

4. Edit `config.json` and fill in your actual values:

   ```json
   {
     "botToken": "YOUR_BOT_TOKEN_HERE",
     "botId": "YOUR_BOT_ID_HERE",
     "dbUrl": "postgresql://user:password@host:5432/database",
     "topggToken": "none"
   }
   ```

   The project expects:
   - `botToken`: Discord bot token
   - `botId`: Discord application/user ID used for slash command registration
   - `dbUrl`: PostgreSQL connection string used by `pg` in `loader.js`
   - `topggToken`: optional; can be left as `"none"` or removed if you do not use Top.gg stats

5. Run the bot again:

   ```bash
   node index.js
   ```

## Runtime behavior

The startup flow is like:

- `index.js` creates `config.json` if it does not exist yet.
- `loader.js` connects to PostgreSQL, creates the required tables if they are missing, loads event handlers, loads all command files, and registers slash commands.
- `server.js` starts a small Express server on port `3000` and redirects `/` to DiversityCraft's website to help keep the bot online on free hosts.
- The message listener in `events/messageCreate.js` handles the command prefix `d!`.
- The interaction listener in `events/interactionCreate.js` handles the slash commands.

## Project layout

- `index.js`: main entry point; creates config if needed and logs in to Discord.
- `loader.js`: loads database connection, music player, events, message commands, and slash commands.
- `server.js`: lightweight keep-alive/redirect server.
- `config.json`: generated at first run; contains settings and DB connection details.
- `commands/`: prefix-based commands grouped by category (fun, economy, image, music, utility, etc.).
- `commands-slash/`: slash commands.
- `events/`: Discord event handlers.
- `utils/`: shared helper functions used by commands and events.
- `media/`: local assets used by the commands or events.
- `local_modules/`: contains customized npm packages.

## Useful places to start reading the code

- `commands/templates/ping.js` for a simple prefix command example
- `commands-slash/help.js` for the slash command example
- `events/messageCreate.js` for the message commands execution
- `events/interactionCreate.js` for the slash commands execution

## Commands and prefixes

- Message commands use the `d!` prefix.
- Slash commands are triggered with `/`.
- Example: `d!help` and `/help`

## Contributing

Contributions are welcome through GitHub pull requests or by testing the bot in a Discord server and reporting bugs. You can invite the bot here:

- [Bot invite link](https://discord.com/api/oauth2/authorize?client_id=878594739744673863&permissions=2080948874566&scope=bot)

Make sure the bot has the permissions needed for the features you want to use.

## License

This project is licensed under the Pier's Projects License (PPL). See `LICENSE.md` for the full terms.

## Support

- Discord Server: [join](https://discord.gg/KxadTdz)
- YouTube: [Pier77Repeter](https://www.youtube.com/@pier77repeter)

## Credits

- Pier77Repeter for the original project
- achernar67 for testing
- everyone who invites and uses the bot
