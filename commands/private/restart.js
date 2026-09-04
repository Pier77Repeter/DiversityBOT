const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const delay = require("../../utils/delay.js");
const loader = require("../../loader.js");
const msgErrorHandler = require("../../utils/msgErrorHandler.js");

module.exports = {
  name: "restart",
  description: "Restart the bot",
  async execute(client, message, args) {
    if (message.author.id !== "724990112030654484") return;

    if (message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageMessages)) {
      try {
        await message.delete();
      } catch (error) {
        msgErrorHandler(error);
      }
    }

    loader.setRestartStatus(true);

    const embed = new EmbedBuilder().setColor(0xffff00).setDescription("**[CONSOLE] Bot restarting in 2 minutes...**");

    try {
      await message.author.send({ embeds: [embed] });
    } catch (error) {
      msgErrorHandler(error);
    }

    await delay(105 * 1000);
    embed.setDescription("**[CONSOLE] Bot restarting in 15 seconds...**");
    try {
      await message.author.send({ embeds: [embed] });
    } catch (error) {
      msgErrorHandler(error);
    }

    await delay(15 * 1000);
    embed.setDescription("**[CONSOLE] Bot is restarting...**");
    try {
      await message.author.send({ embeds: [embed] });
    } catch (error) {
      msgErrorHandler(error);
    }

    await delay(1000);
    loader.shutdownLoader(client);
  },
};
