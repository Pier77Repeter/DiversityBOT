const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");
const serverCooldownManager = require("../utils/serverCooldownManager");

// mentionedUser is an optional parameter, look https://www.geeksforgeeks.org/javascript/how-to-declare-the-optional-function-parameters-in-javascript/
module.exports = async function discImgGen(client, message, imageName, mentionedUser = null) {
  const logPrefix = "[DiscImgGen]: ";
  const cooldownInSecs = 10;

  const cooldown = await serverCooldownManager(client, message, "imageCooldown", cooldownInSecs);
  if (cooldown == null) return;

  const embed = new EmbedBuilder();

  if (cooldown != 0) {
    embed.setColor(0x000000).setDescription("⏰ You can create another image: **<t:" + cooldown[1] + ":R>**");

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  }

  const attachment = new AttachmentBuilder();
  const avatar = message.mentions.members.first()
    ? message.mentions.members.first().user.displayAvatarURL({ extension: "png" })
    : message.author.displayAvatarURL({ extension: "png" });
  // some commands require 2 avatars
  const msgAuthAvatar = message.author.displayAvatarURL({ extension: "png" });
  const avatar2 = mentionedUser ? mentionedUser.displayAvatarURL({ extension: "png" }) : null;

  var editedImage;

  switch (imageName.toLowerCase()) {
    case "ad":
      editedImage = await new DIG.Ad().getImage(avatar);

      attachment.setFile(editedImage).setName("ad.png");

      return await sendMessage();

    case "affect":
      editedImage = await new DIG.Affect().getImage(avatar);

      attachment.setFile(editedImage).setName("affect.png");

      return await sendMessage();

    case "batslap":
      // mentionedUser MUST be valid
      if ((await checkMentionedUser()) != 0) return;

      editedImage = await new DIG.Batslap().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("batslap.png");

      return await sendMessage();

    case "beautiful":
      editedImage = await new DIG.Beautiful().getImage(avatar);

      attachment.setFile(editedImage).setName("beautiful.png");

      return await sendMessage();

    case "bed":
      if ((await checkMentionedUser()) != 0) return;

      editedImage = await new DIG.Bed().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("bed.png");

      return await sendMessage();

    case "blink":
      if ((await checkMentionedUser()) != 0) return;

      const avatars = [msgAuthAvatar, avatar2];

      editedImage = await new DIG.Blink().getImage(10, ...avatars);

      attachment.setFile(editedImage).setName("blink.gif");

      return await sendMessage();

    default:
      break;
  }

  // some commands require 2 avatars, better check for the 2nd mention
  async function checkMentionedUser() {
    if (mentionedUser == null) {
      try {
        return await message.reply(message.author.username + ", please mention an user, thanks");
      } catch (error) {
        return;
      }
    }

    return 0;
  }

  // i dont want to rewrite everytime this peace of code
  async function sendMessage() {
    try {
      return await message.reply({ files: [attachment] });
    } catch (error) {
      return;
    }
  }
};
