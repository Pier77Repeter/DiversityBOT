const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../utils/msgErrorHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get the description and aliases of a command")
    .addStringOption((option) => option.setName("command").setDescription("Name of the command, type / at the beginning for slash commands").setRequired(true)),

  async execute(client, interaction) {
    const embed = new EmbedBuilder();
    const cmd = interaction.options.getString("command");
    const isSlashCommand = cmd.startsWith("/");
    const commandName = cmd.slice(isSlashCommand ? 1 : 0).toLowerCase();
    const command = isSlashCommand ? client.slashCommands.get(commandName) : client.commands.get(commandName);

    if (!command) {
      embed.setColor("Red").setTitle("❌ Not Found").setDescription("The provided command dosen't exist, either type **d!help** or **/help**");

      interaction.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const description = isSlashCommand ? command?.data.toJSON().description : command?.description;

    embed
      .setColor("Blurple")
      .setTitle(`📖 ${isSlashCommand ? `/${commandName}` : `d!${commandName}`}`)
      .setDescription(description)
      .addFields({ name: "Aliases", value: `${command.aliases ? command.aliases.join(", ") : "None"}` });

    interaction.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
