const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const randomColor = require("../../utils/randomColor.js");

module.exports = {
  name: "say",
  description: "Replies with the message from the author",
  async execute(client, message, args) {
    const maxLength = 2000;
    const content = "<" + message.author.username + "> " + args.join(" ");

    if (content.length > maxLength) {
      try {
        return await message.reply(`Message too long! Maximum length is ${maxLength} characters.`);
      } catch (error) {
        return;
      }
    }

    const embed = new EmbedBuilder().setColor(randomColor()).setDescription("<" + message.author.username + "> " + args.join(" "));

    try {
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      return;
    }

    // put this here so that even if we cant delete the message at least it still works
    if (!message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ManageMessages)) return;
    try {
      return await message.delete();
    } catch (error) {
      return;
    }
  },
};
