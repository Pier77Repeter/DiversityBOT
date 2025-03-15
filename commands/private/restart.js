const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const delay = require("../../utils/delay.js");
const loader = require("../../loader.js");

module.exports = {
  name: "restart",
  description: "Restart the bot",
  isRestarting: false,
  async execute(client, message, args) {
    if (message.author.id !== "724990112030654484") return;

    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageMessages)) return;

    restart = true;
    try {
      await message.delete();
    } catch (error) {
      // continue the restart
    }

    const restartMessageEmbed = new EmbedBuilder()
      .setColor(0xffff00)
      .setDescription("**[CONSOLE] Bot restarting in 2 minutes...**");
    try {
      await message.author.send({ embeds: [restartMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(105 * 1000);
    restartMessageEmbed.setDescription("**[CONSOLE] Bot restarting in 15 seconds...**");
    try {
      await message.author.send({ embeds: [restartMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(15 * 1000);
    restartMessageEmbed.setDescription("**[CONSOLE] Bot is restarting...**");
    try {
      await message.author.send({ embeds: [restartMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(1000);
    loader.shutdownLoader(client);
  },
};
