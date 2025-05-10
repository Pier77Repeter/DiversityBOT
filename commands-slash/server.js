const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("server").setDescription("Shows all the stats of the server"),

  async execute(client, interaction) {
    const members = await interaction.guild.members.fetch();
    const nonBotMemberCount = members.filter((member) => !member.user.bot).size;
    const botMemberCount = members.filter((member) => member.user.bot).size;

    const channels = await interaction.guild.channels.fetch();
    const textChannelCount = channels.filter((channel) => channel.type === 0).size;
    const voiceChannelCount = channels.filter((channel) => channel.type === 2).size;

    const serverStatsMessageEmbed = new EmbedBuilder()
      .setColor(0x000099)
      .setTitle([interaction.guild.name + "'s informations"].join(""))
      .setDescription(
        [
          "Server ID: **" + interaction.guild.id + "**",
          "",
          "Server owner: <@" + interaction.guild.ownerId + ">",
          "",
          "Server creation date: `" + interaction.guild.createdAt + "`",
          "",
          "Boost level: `" + interaction.guild.premiumTier + "`",
          "",
          "Server boosts: `" + interaction.guild.premiumSubscriptionCount + "`",
          "",
          "Total users: `" + interaction.guild.memberCount + "`",
          "",
          "Members: `" + nonBotMemberCount + "`",
          "",
          "Bots: `" + botMemberCount + "`",
          "",
          "Number of text channels: `" + textChannelCount + "`",
          "",
          "Number of voice channels: `" + voiceChannelCount + "`",
          "",
          "Role slots: `" + interaction.guild.roles.cache.size + "/250`",
          "",
          "**Server icon:**",
        ].join("\n")
      )
      .setImage(interaction.guild.iconURL({ dynamic: true }))
      .setFooter({ text: "View the server's configs with /config" });

    try {
      return await interaction.reply({ embeds: [serverStatsMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
