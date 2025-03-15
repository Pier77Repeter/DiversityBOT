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
          "\n",
          "\n",
          "Server owner: <@" + interaction.guild.ownerId + ">",
          "\n",
          "\n",
          "Server creation date: `" + interaction.guild.createdAt + "`",
          "\n",
          "\n",
          "Boost level: `" + interaction.guild.premiumTier + "`",
          "\n",
          "\n",
          "Server boosts: `" + interaction.guild.premiumSubscriptionCount + "`",
          "\n",
          "\n",
          "Total users: `" + interaction.guild.memberCount + "`",
          "\n",
          "\n",
          "Members: `" + nonBotMemberCount + "`",
          "\n",
          "\n",
          "Bots: `" + botMemberCount + "`",
          "\n",
          "\n",
          "Number of text channels: `" + textChannelCount + "`",
          "\n",
          "\n",
          "Number of voice channels: `" + voiceChannelCount + "`",
          "\n",
          "\n",
          "Role slots: `" + interaction.guild.roles.cache.size + "/250`",
          "\n",
          "\n",
          "**Server icon:**",
        ].join("")
      )
      .setImage(interaction.guild.iconURL({ dynamic: true }));

    try {
      return await interaction.reply({ embeds: [serverStatsMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
