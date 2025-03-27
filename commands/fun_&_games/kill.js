const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const listsGetRandomItem = require("../../utils/listsGetRandomItem");

module.exports = {
  name: "kill",
  description: "Kill an user with funny image and msg",
  async execute(client, message, args) {
    try {
      if (message.mentions.members.first() == null)
        return await message.reply(message.author.username + ", can you mention an user?");
    } catch (error) {
      return;
    }

    const mentionedMember = message.mentions.members.first().user.username;
    const imageFile = new AttachmentBuilder("./media/funnyKillImage.jpg");
    const killMessageEmbed = new EmbedBuilder()
      .setColor(0x660000)
      .setDescription(
        listsGetRandomItem(
          [
            "**" + message.author.username + " killed " + mentionedMember + " with a Diamond sword**",
            "**" + message.author.username + " killed " + mentionedMember + " with an End Crystal**",
            "**" + message.author.username + " killed " + mentionedMember + " with an Arrow**",
            "**" + message.author.username + " killed " + mentionedMember + " with a bed explosion**",
            "**" + message.author.username + " killed " + mentionedMember + " with a fucking nuke**",
            "**" + message.author.username + " killed " + mentionedMember + " using Petotu's face**",
            "**" + message.author.username + " killed " + mentionedMember + " using his super powers**",
            "**" + message.author.username + " killed " + mentionedMember + " with the power of rushershack!**",
            "**" + message.author.username + " killed " + mentionedMember + " with a fart** ",
            "**" + message.author.username + " killed " + mentionedMember + " using their own keyboard**",
            "**" + message.author.username + " killed " + mentionedMember + " with a cup of hot tea**",
            "**" + mentionedMember + " died**",
            "**" + mentionedMember + " was disabled due to an exploit**",
            "**" + mentionedMember + " forgot the floor was lava**",
            "**" + mentionedMember + " fell of his chair**",
            "**" + mentionedMember + " exploded like a bomb**",
            "**" + mentionedMember + " played too many hours at PVP games**",
            "**" + mentionedMember + " was banned by a Discord Mod**",
            "**" + mentionedMember + " forgot how to use a gun**",
            "**" + mentionedMember + " was killed by Freddy because power went down**",
            "**" + mentionedMember + " was nuked by Trump**",
            "**" + mentionedMember + " was boned to death**",
            "**" + mentionedMember + " crashed* ",
            "**" + mentionedMember + " drinked a poison**",
            "**" + mentionedMember + " didn't sleep**",
            "**" + mentionedMember + " was eated by Pac Man**",
            "**" + mentionedMember + " watched too many Anime**",
            "**" + mentionedMember + " sunk with the Titanic**",
            "**" + mentionedMember + " was killed by a Zombie**",
            "**" + mentionedMember + " was shot by a Skeleton**",
            "**" + mentionedMember + " was teleported away with an Enderman**",
            "**" + mentionedMember + " lost the match and died** ",
            "**" + mentionedMember + " died because yes, for no reasons at all**",
            "**" + mentionedMember + " was MANZH by Foxy**",
            "**" + mentionedMember + " tried to do a speedrun...**",
          ],
          false
        )
      )
      .setImage("attachment://funnyKillImage.jpg");

    try {
      return await message.reply({ embeds: [killMessageEmbed], files: [imageFile] });
    } catch (error) {
      return;
    }
  },
};
