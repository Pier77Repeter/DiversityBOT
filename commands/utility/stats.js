const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "stats",
  description: "Get the stats of a member",
  async execute(client, message, args) {
    const user = message.mentions.members.first() ? message.mentions.members.first().user : message.author;
    const member = await message.guild.members.fetch(user.id);
    const memberPfp = user.displayAvatarURL({ dynamic: true });
    const globalName = user.globalName || "None";

    const embed = new EmbedBuilder()
      .setColor(0x000099)
      .setTitle(["🪪 " + user.username + "'s informations"].join(""))
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
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
