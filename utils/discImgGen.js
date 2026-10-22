const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");
const logger = require("../logger")("DiscImgGen");
const msgErrorHandler = require("./msgErrorHandler");
const serverCooldownManager = require("../utils/serverCooldownManager");

// some commands require 2 avatars, better check for the 2nd mention
function checkMentionedUser(mentionedUser) {
  if (mentionedUser) return true;

  sentMessage.edit({ content: `${message.author.username}, please mention an user, thanks`, embeds: [] }).catch(msgErrorHandler);
  return false;
}

// mentionedUser is an optional parameter, look https://www.geeksforgeeks.org/javascript/how-to-declare-the-optional-function-parameters-in-javascript/
module.exports = async function discImgGen(client, message, imageName, mentionedUser = null) {
  const cooldownInSecs = 10;

  const cooldown = await serverCooldownManager(client, message, "image_cooldown", cooldownInSecs);
  if (cooldown === null) return;

  const embed = new EmbedBuilder();

  if (cooldown) {
    embed.setColor(0x000000).setDescription("⏰ You can create another image **<t:" + cooldown[1] + ":R>**");

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    return;
  }

  embed.setColor(0xffcc66).setTitle("👨‍🍳 Cooking the image, please wait...");

  const sentMessage = await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  if (!sentMessage) return;

  const attachment = new AttachmentBuilder();
  const avatar = message.mentions.members.first()
    ? message.mentions.members.first().user.displayAvatarURL({ extension: "png" })
    : message.author.displayAvatarURL({ extension: "png" });
  // some commands require 2 avatars
  const msgAuthAvatar = message.author.displayAvatarURL({ extension: "png" });
  const avatar2 = mentionedUser ? mentionedUser.displayAvatarURL({ extension: "png" }) : null;
  const avatars = [msgAuthAvatar, avatar2];

  let editedImage;

  switch (imageName.toLowerCase()) {
    case "ad":
      editedImage = await new DIG.Ad().getImage(avatar);

      attachment.setFile(editedImage).setName("ad.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

      // all done! :D
      break;

    case "affect":
      editedImage = await new DIG.Affect().getImage(avatar);

      attachment.setFile(editedImage).setName("affect.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "batslap":
      // mentionedUser MUST be valid
      if (!checkMentionedUser(mentionedUser)) return;

      editedImage = await new DIG.Batslap().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("batslap.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "beautiful":
      editedImage = await new DIG.Beautiful().getImage(avatar);

      attachment.setFile(editedImage).setName("beautiful.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "bed":
      if (!checkMentionedUser(mentionedUser)) return;

      editedImage = await new DIG.Bed().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("bed.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "blink":
      if (!checkMentionedUser(mentionedUser)) return;

      editedImage = await new DIG.Blink().getImage(10, ...avatars);

      attachment.setFile(editedImage).setName("blink.gif");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "blur":
      editedImage = await new DIG.Blur().getImage(avatar, 3);

      attachment.setFile(editedImage).setName("blur.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "bobross":
      editedImage = await new DIG.Bobross().getImage(avatar);

      attachment.setFile(editedImage).setName("bobross.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "circle":
      editedImage = await new DIG.Circle().getImage(avatar);

      attachment.setFile(editedImage).setName("circle.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "clown":
      editedImage = await new DIG.Clown().getImage(avatar);

      attachment.setFile(editedImage).setName("clown.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "confusedstonk":
      editedImage = await new DIG.ConfusedStonk().getImage(avatar);

      attachment.setFile(editedImage).setName("confusedstonk.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "deepfry":
      editedImage = await new DIG.Deepfry().getImage(avatar);

      attachment.setFile(editedImage).setName("deepfry.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "delete":
      editedImage = await new DIG.Delete().getImage(avatar);

      attachment.setFile(editedImage).setName("delete.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "denoise":
      editedImage = await new DIG.Denoise().getImage(avatar, 3);

      attachment.setFile(editedImage).setName("denoise.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "discordblack":
      editedImage = await new DIG.DiscordBlack().getImage(avatar);

      attachment.setFile(editedImage).setName("discordblack.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "discordblue":
      editedImage = await new DIG.DiscordBlue().getImage(avatar);

      attachment.setFile(editedImage).setName("discordblue.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "doublestonk":
      if (!checkMentionedUser(mentionedUser)) return;

      editedImage = await new DIG.DoubleStonk().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("doublestonk.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "facepalm":
      editedImage = await new DIG.Facepalm().getImage(avatar);

      attachment.setFile(editedImage).setName("facepalm.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "gay":
      editedImage = await new DIG.Gay().getImage(avatar);

      attachment.setFile(editedImage).setName("gay.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "greyscale":
      editedImage = await new DIG.Greyscale().getImage(avatar);

      attachment.setFile(editedImage).setName("greyscale.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "heartbreaking":
      editedImage = await new DIG.Heartbreaking().getImage(avatar);

      attachment.setFile(editedImage).setName("heartbreaking.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "hitler":
      editedImage = await new DIG.Hitler().getImage(avatar);

      attachment.setFile(editedImage).setName("hitler.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "invert":
      editedImage = await new DIG.Invert().getImage(avatar);

      attachment.setFile(editedImage).setName("invert.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "jail":
      editedImage = await new DIG.Jail().getImage(avatar);

      attachment.setFile(editedImage).setName("jail.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "karaba":
      editedImage = await new DIG.Karaba().getImage(avatar);

      attachment.setFile(editedImage).setName("karaba.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "kiss":
      if (!checkMentionedUser(mentionedUser)) return;

      editedImage = await new DIG.Kiss().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("kiss.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "mikkelsen":
      editedImage = await new DIG.Mikkelsen().getImage(avatar);

      attachment.setFile(editedImage).setName("mikkelsen.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "mirrorhor":
      editedImage = await new DIG.Mirror().getImage(avatar, true);

      attachment.setFile(editedImage).setName("mirror-horizontal.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "mirrorver":
      editedImage = await new DIG.Mirror().getImage(avatar, false, true);

      attachment.setFile(editedImage).setName("mirror-vertical.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "mms":
      editedImage = await new DIG.Mms().getImage(avatar);

      attachment.setFile(editedImage).setName("mms.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "notstonk":
      editedImage = await new DIG.NotStonk().getImage(avatar);

      attachment.setFile(editedImage).setName("notstonk.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "poutine":
      editedImage = await new DIG.Poutine().getImage(avatar);

      attachment.setFile(editedImage).setName("poutine.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "rip":
      editedImage = await new DIG.Rip().getImage(avatar);

      attachment.setFile(editedImage).setName("rip.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "sepia":
      editedImage = await new DIG.Sepia().getImage(avatar);

      attachment.setFile(editedImage).setName("sepia.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "snyder":
      editedImage = await new DIG.Snyder().getImage(avatar);

      attachment.setFile(editedImage).setName("snyder.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "spank":
      if (!checkMentionedUser(mentionedUser)) return;

      editedImage = await new DIG.Spank().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("spank.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "stonk":
      editedImage = await new DIG.Stonk().getImage(avatar);

      attachment.setFile(editedImage).setName("stonk.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "tatoo":
      editedImage = await new DIG.Tatoo().getImage(avatar);

      attachment.setFile(editedImage).setName("tatoo.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "thomas":
      editedImage = await new DIG.Thomas().getImage(avatar);

      attachment.setFile(editedImage).setName("thomas.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "trash":
      editedImage = await new DIG.Trash().getImage(avatar);

      attachment.setFile(editedImage).setName("trash.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "triggered":
      editedImage = await new DIG.Triggered().getImage(avatar);

      attachment.setFile(editedImage).setName("triggered.gif");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    case "wanted":
      editedImage = await new DIG.Wanted().getImage(avatar);

      attachment.setFile(editedImage).setName("wanted.png");

      sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);
      break;

    default:
      logger.error(`The image named '${imageName}' does NOT exist`);

      embed
        .setColor(0xff0000)
        .setTitle("⚠️ Critical Error")
        .setDescription("Apparently the image i'm trying to generate dosen't exist, this is a bug, this is not supposed to happen, i am sorry.")
        .addFields({ name: "Submit Report Here", value: "https://discord.gg/KxadTdz" });

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      break;
  }
};
