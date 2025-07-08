const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("member")
    .setDescription("Display the information of a member")
    .addUserOption((option) => option.setName("user").setDescription("The member to display information about").setRequired(false)),

  async execute(client, interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);
    const memberPfp = user.displayAvatarURL({ dynamic: true });
    const globalName = user.globalName || "None";

    const embed = new EmbedBuilder()
      .setColor(0x000099)
      .setTitle([user.username + "'s informations"].join(""))
      .setDescription(
        [
          "**Global name:** " + globalName,
          "",
          "**ID:** " + member.id,
          "",
          "**Join date:** " + member.joinedAt,
          "",
          "**Account creation date:** " + user.createdAt,
          "",
          "**Roles:** " + member.roles.cache.map((role) => role.toString()).join(", "),
          "",
          "**Profile picture:**",
        ].join("\n")
      )
      .setImage(memberPfp);

    try {
      return await interaction.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
