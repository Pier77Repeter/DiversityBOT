const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "server",
  description: "Get sever information",
  async execute(client, message, args) {
    const members = await message.guild.members.fetch();
    const nonBotMemberCount = members.filter((member) => !member.user.bot).size;
    const botMemberCount = members.filter((member) => member.user.bot).size;

    const channels = await message.guild.channels.fetch();
    const textChannelCount = channels.filter((channel) => channel.type === 0).size;
    const voiceChannelCount = channels.filter((channel) => channel.type === 2).size;

    const embed = new EmbedBuilder()
      .setColor(0x000099)
      .setTitle(["📒 " + message.guild.name + "'s informations"].join(""))
      .setDescription(
        [
          "Server ID: **" + message.guild.id + "**",
          "",
          "Server owner: <@" + message.guild.ownerId + ">",
          "",
          "Server creation date: `" + message.guild.createdAt + "`",
          "",
          "Boost level: `" + message.guild.premiumTier + "`",
          "",
          "Server boosts: `" + message.guild.premiumSubscriptionCount + "`",
          "",
          "Total users: `" + message.guild.memberCount + "`",
          "",
          "Members: `" + nonBotMemberCount + "`",
          "",
          "Bots: `" + botMemberCount + "`",
          "",
          "Number of text channels: `" + textChannelCount + "`",
          "",
          "Number of voice channels: `" + voiceChannelCount + "`",
          "",
          "Role slots: `" + message.guild.roles.cache.size + "/250`",
          "",
          "**Server icon:**",
        ].join("\n")
      )
      .setImage(message.guild.iconURL({ dynamic: true }))
      .setFooter({ text: "View the server's configs with d!config" });

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
