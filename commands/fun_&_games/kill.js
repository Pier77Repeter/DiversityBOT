const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const listsGetRandomItem = require("../../utils/listsGetRandomItem");

// for this command TURN OFF 'Format on save' option in VSC
module.exports = {
  name: "kill",
  description: "Kill an user with funny image and msg",
  async execute(client, message, args) {
    try {
      if (message.mentions.members.first() == null) return await message.reply(message.author.username + ", can you mention an user?");
    } catch (error) {
      return;
    }

    const imageFile = new AttachmentBuilder("./media/funnyKillImage.jpg");
    const killMessageEmbed = new EmbedBuilder()
      .setColor(0x660000)
      .setDescription(
        listsGetRandomItem(
          [
            "**" + message.author.username + " killed " + message.mentions.members.first().user.username + " with a Diamond sword**",
            "**" + message.author.username + " killed " + message.mentions.members.first().user.username + " with an End Crystal**",
            "**" + message.author.username + " killed " + message.mentions.members.first().user.username + " with an Arrow**",
            "**" + message.author.username + " killed " + message.mentions.members.first().user.username + " with a bed explosion**",
            "**" + message.author.username + " killed " + message.mentions.members.first().user.username + " with a fucking nuke**",
            "**" + message.author.username + " killed " + message.mentions.members.first().user.username + " using Petotu's face**",
            "**" + message.author.username + " killed " + message.mentions.members.first().user.username + " using his super powers**",
            "**" + message.author.username + " killed " + message.mentions.members.first().user.username + " with the power of rushershack!**",
            "**" + message.author.username + " killed " + message.mentions.members.first().user.username + " with a fart** ",
            "**" + message.author.username + " killed " + message.mentions.members.first().user.username + " using their own keyboard**",
            "**" + message.author.username + " killed " + message.mentions.members.first().user.username + " with a cup of hot tea**",
            "**" + message.mentions.members.first().user.username + " died**",
            "**" + message.mentions.members.first().user.username + " was disabled due to an exploit**",
            "**" + message.mentions.members.first().user.username + " forgot the floor was lava**",
            "**" + message.mentions.members.first().user.username + " fell of his chair**",
            "**" + message.mentions.members.first().user.username + " exploded like a bomb**",
            "**" + message.mentions.members.first().user.username + " played too many hours at PVP games**",
            "**" + message.mentions.members.first().user.username + " was banned by a Discord Mod**",
            "**" + message.mentions.members.first().user.username + " forgot how to use a gun**",
            "**" + message.mentions.members.first().user.username + " was killed by Freddy because power went down**",
            "**" + message.mentions.members.first().user.username + " was nuked by Trump**",
            "**" + message.mentions.members.first().user.username + " was boned to death**",
            "**" + message.mentions.members.first().user.username + " crashed* ",
            "**" + message.mentions.members.first().user.username + " drinked a poison**",
            "**" + message.mentions.members.first().user.username + " didn't sleep**",
            "**" + message.mentions.members.first().user.username + " was eated by Pac Man**",
            "**" + message.mentions.members.first().user.username + " watched too many Anime**",
            "**" + message.mentions.members.first().user.username + " sunk with the Titanic**",
            "**" + message.mentions.members.first().user.username + " was killed by a Zombie**",
            "**" + message.mentions.members.first().user.username + " was shot by a Skeleton**",
            "**" + message.mentions.members.first().user.username + " was teleported away with an Enderman**",
            "**" + message.mentions.members.first().user.username + " lost the match and died** ",
            "**" + message.mentions.members.first().user.username + " died because yes, for no reasons at all**",
            "**" + message.mentions.members.first().user.username + " was MANZH by Foxy**",
            "**" + message.mentions.members.first().user.username + " tried to do a speedrun...**",
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
