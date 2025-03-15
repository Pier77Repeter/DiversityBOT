const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  // slash command data (name, description), required
  data: new SlashCommandBuilder()
    .setName("member")
    .setDescription("Display the information of a member")
    .addUserOption((option) =>
      option.setName("user").setDescription("The member to display information about").setRequired(false)
    ),

  // slash command's logic
  async execute(client, interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);
    const memberPfp = user.displayAvatarURL({ dynamic: true });
    const globalName = user.globalName || "None";

    const memberInfoMessageEmbed = new EmbedBuilder()
      .setColor(0x000099)
      .setTitle([user.username + "'s informations"].join(""))
      .setDescription(
        [
          "**Global name:** " + globalName,
          "\n",
          "\n",
          "**ID:** " + member.id,
          "\n",
          "\n",
          "**Join date:** " + member.joinedAt,
          "\n",
          "\n",
          "**Account creation date:** " + user.createdAt,
          "\n",
          "\n",
          "**Roles:** " + member.roles.cache.map((role) => role.toString()).join(", "),
          "\n",
          "\n",
          "**Profile picture:**",
        ].join("")
      )
      .setImage(memberPfp);

    try {
      return await interaction.reply({ embeds: [memberInfoMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
