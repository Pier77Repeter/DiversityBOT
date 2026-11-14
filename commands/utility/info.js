const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "info",
  description: "Get the description and aliases of a command",
  async execute(client, message, args) {
    const input = args[0];

    const embed = new EmbedBuilder();

    if (!input) {
      embed.setColor("Red").setTitle("❌ Missing Input").setDescription("Provide a command name for example: **d!info help** or **d!info /help**");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const isSlashCommand = input.startsWith("/");
    const commandName = input.slice(isSlashCommand ? 1 : 0).toLowerCase();
    const command = isSlashCommand ? client.slashCommands.get(commandName) : client.commands.get(commandName);

    if (!command) {
      embed.setColor("Red").setTitle("❌ Not Found").setDescription("The provided command doesn't exist, either type **d!help** or **/help**");

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    // slash commands have their setDescription() function
    const description = isSlashCommand ? command?.data.toJSON().description : command?.description;

    embed
      .setColor("Blurple")
      .setTitle(`📖 ${isSlashCommand ? `/${commandName}` : `d!${commandName}`}`)
      .setDescription(description)
      .addFields({ name: "Aliases", value: `${command.aliases ? command.aliases.join(", ") : "None"}` });

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
