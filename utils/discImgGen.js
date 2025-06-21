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
  const avatars = [msgAuthAvatar, avatar2];
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

      editedImage = await new DIG.Blink().getImage(10, ...avatars);

      attachment.setFile(editedImage).setName("blink.gif");

      return await sendMessage();

    case "blur":
      editedImage = await new DIG.Blur().getImage(avatar, 3);

      attachment.setFile(editedImage).setName("blur.png");

      return await sendMessage();

    case "bobross":
      editedImage = await new DIG.Bobross().getImage(avatar);

      attachment.setFile(editedImage).setName("bobross.png");

      return await sendMessage();

    case "circle":
      editedImage = await new DIG.Circle().getImage(avatar);

      attachment.setFile(editedImage).setName("circle.png");

      return await sendMessage();

    case "clown":
      editedImage = await new DIG.Clown().getImage(avatar);

      attachment.setFile(editedImage).setName("clown.png");

      return await sendMessage();

    case "confusedstonk":
      editedImage = await new DIG.ConfusedStonk().getImage(avatar);

      attachment.setFile(editedImage).setName("confusedstonk.png");

      return await sendMessage();

    case "deepfry":
      editedImage = await new DIG.Deepfry().getImage(avatar);

      attachment.setFile(editedImage).setName("deepfry.png");

      return await sendMessage();

    case "delete":
      editedImage = await new DIG.Delete().getImage(avatar);

      attachment.setFile(editedImage).setName("delete.png");

      return await sendMessage();

    case "denoise":
      editedImage = await new DIG.Denoise().getImage(avatar, 3);

      attachment.setFile(editedImage).setName("denoise.png");

      return await sendMessage();

    case "discordblack":
      editedImage = await new DIG.DiscordBlack().getImage(avatar);

      attachment.setFile(editedImage).setName("discordblack.png");

      return await sendMessage();

    case "discordblue":
      editedImage = await new DIG.DiscordBlue().getImage(avatar);

      attachment.setFile(editedImage).setName("discordblue.png");

      return await sendMessage();

    case "doublestonk":
      if ((await checkMentionedUser()) != 0) return;

      editedImage = await new DIG.DoubleStonk().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("doublestonk.png");

      return await sendMessage();

    case "facepalm":
      editedImage = await new DIG.Facepalm().getImage(avatar);

      attachment.setFile(editedImage).setName("facepalm.png");

      return await sendMessage();

    case "gay":
      editedImage = await new DIG.Gay().getImage(avatar);

      attachment.setFile(editedImage).setName("gay.png");

      return await sendMessage();

    case "greyscale":
      editedImage = await new DIG.Greyscale().getImage(avatar);

      attachment.setFile(editedImage).setName("greyscale.png");

      return await sendMessage();

    case "heartbreaking":
      editedImage = await new DIG.Heartbreaking().getImage(avatar);

      attachment.setFile(editedImage).setName("heartbreaking.png");

      return await sendMessage();

    case "hitler":
      editedImage = await new DIG.Hitler().getImage(avatar);

      attachment.setFile(editedImage).setName("hitler.png");

      return await sendMessage();

    case "invert":
      editedImage = await new DIG.Invert().getImage(avatar);

      attachment.setFile(editedImage).setName("invert.png");

      return await sendMessage();

    case "jail":
      editedImage = await new DIG.Jail().getImage(avatar);

      attachment.setFile(editedImage).setName("jail.png");

      return await sendMessage();

    case "karaba":
      editedImage = await new DIG.Karaba().getImage(avatar);

      attachment.setFile(editedImage).setName("karaba.png");

      return await sendMessage();

    case "kiss":
      if ((await checkMentionedUser()) != 0) return;

      editedImage = await new DIG.Kiss().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("kiss.png");

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
