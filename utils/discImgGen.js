const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");
const logger = require("../logger")("DiscImgGen");
const serverCooldownManager = require("../utils/serverCooldownManager");
const msgErrorHandler = require("./msgErrorHandler");

// mentionedUser is an optional parameter, look https://www.geeksforgeeks.org/javascript/how-to-declare-the-optional-function-parameters-in-javascript/
module.exports = async function discImgGen(client, message, imageName, mentionedUser = null) {
  const cooldownInSecs = 10;

  const cooldown = await serverCooldownManager(client, message, "image_cooldown", cooldownInSecs);
  if (cooldown === null) return;

  const embed = new EmbedBuilder();

  if (cooldown) {
    embed.setColor(0x000000).setDescription("⏰ You can create another image **<t:" + cooldown[1] + ":R>**");
    return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
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

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "affect":
      editedImage = await new DIG.Affect().getImage(avatar);

      attachment.setFile(editedImage).setName("affect.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "batslap":
      // mentionedUser MUST be valid
      if (!(await checkMentionedUser())) return;

      editedImage = await new DIG.Batslap().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("batslap.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "beautiful":
      editedImage = await new DIG.Beautiful().getImage(avatar);

      attachment.setFile(editedImage).setName("beautiful.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "bed":
      if (!(await checkMentionedUser())) return;

      editedImage = await new DIG.Bed().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("bed.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "blink":
      if (!(await checkMentionedUser())) return;

      editedImage = await new DIG.Blink().getImage(10, ...avatars);

      attachment.setFile(editedImage).setName("blink.gif");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "blur":
      editedImage = await new DIG.Blur().getImage(avatar, 3);

      attachment.setFile(editedImage).setName("blur.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "bobross":
      editedImage = await new DIG.Bobross().getImage(avatar);

      attachment.setFile(editedImage).setName("bobross.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "circle":
      editedImage = await new DIG.Circle().getImage(avatar);

      attachment.setFile(editedImage).setName("circle.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "clown":
      editedImage = await new DIG.Clown().getImage(avatar);

      attachment.setFile(editedImage).setName("clown.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "confusedstonk":
      editedImage = await new DIG.ConfusedStonk().getImage(avatar);

      attachment.setFile(editedImage).setName("confusedstonk.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "deepfry":
      editedImage = await new DIG.Deepfry().getImage(avatar);

      attachment.setFile(editedImage).setName("deepfry.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "delete":
      editedImage = await new DIG.Delete().getImage(avatar);

      attachment.setFile(editedImage).setName("delete.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "denoise":
      editedImage = await new DIG.Denoise().getImage(avatar, 3);

      attachment.setFile(editedImage).setName("denoise.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "discordblack":
      editedImage = await new DIG.DiscordBlack().getImage(avatar);

      attachment.setFile(editedImage).setName("discordblack.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "discordblue":
      editedImage = await new DIG.DiscordBlue().getImage(avatar);

      attachment.setFile(editedImage).setName("discordblue.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "doublestonk":
      if (!(await checkMentionedUser())) return;

      editedImage = await new DIG.DoubleStonk().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("doublestonk.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "facepalm":
      editedImage = await new DIG.Facepalm().getImage(avatar);

      attachment.setFile(editedImage).setName("facepalm.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "gay":
      editedImage = await new DIG.Gay().getImage(avatar);

      attachment.setFile(editedImage).setName("gay.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "greyscale":
      editedImage = await new DIG.Greyscale().getImage(avatar);

      attachment.setFile(editedImage).setName("greyscale.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "heartbreaking":
      editedImage = await new DIG.Heartbreaking().getImage(avatar);

      attachment.setFile(editedImage).setName("heartbreaking.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "hitler":
      editedImage = await new DIG.Hitler().getImage(avatar);

      attachment.setFile(editedImage).setName("hitler.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "invert":
      editedImage = await new DIG.Invert().getImage(avatar);

      attachment.setFile(editedImage).setName("invert.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "jail":
      editedImage = await new DIG.Jail().getImage(avatar);

      attachment.setFile(editedImage).setName("jail.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "karaba":
      editedImage = await new DIG.Karaba().getImage(avatar);

      attachment.setFile(editedImage).setName("karaba.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "kiss":
      if (!(await checkMentionedUser())) return;

      editedImage = await new DIG.Kiss().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("kiss.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "mikkelsen":
      editedImage = await new DIG.Mikkelsen().getImage(avatar);

      attachment.setFile(editedImage).setName("mikkelsen.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "mirrorhor":
      editedImage = await new DIG.Mirror().getImage(avatar, true);

      attachment.setFile(editedImage).setName("mirror-horizontal.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "mirrorver":
      editedImage = await new DIG.Mirror().getImage(avatar, false, true);

      attachment.setFile(editedImage).setName("mirror-vertical.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "mms":
      editedImage = await new DIG.Mms().getImage(avatar);

      attachment.setFile(editedImage).setName("mms.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "notstonk":
      editedImage = await new DIG.NotStonk().getImage(avatar);

      attachment.setFile(editedImage).setName("notstonk.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "poutine":
      editedImage = await new DIG.Poutine().getImage(avatar);

      attachment.setFile(editedImage).setName("poutine.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "rip":
      editedImage = await new DIG.Rip().getImage(avatar);

      attachment.setFile(editedImage).setName("rip.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "sepia":
      editedImage = await new DIG.Sepia().getImage(avatar);

      attachment.setFile(editedImage).setName("sepia.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "snyder":
      editedImage = await new DIG.Snyder().getImage(avatar);

      attachment.setFile(editedImage).setName("snyder.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "spank":
      if (!(await checkMentionedUser())) return;

      editedImage = await new DIG.Spank().getImage(msgAuthAvatar, avatar2);

      attachment.setFile(editedImage).setName("spank.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "stonk":
      editedImage = await new DIG.Stonk().getImage(avatar);

      attachment.setFile(editedImage).setName("stonk.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "tatoo":
      editedImage = await new DIG.Tatoo().getImage(avatar);

      attachment.setFile(editedImage).setName("tatoo.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "thomas":
      editedImage = await new DIG.Thomas().getImage(avatar);

      attachment.setFile(editedImage).setName("thomas.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "trash":
      editedImage = await new DIG.Trash().getImage(avatar);

      attachment.setFile(editedImage).setName("trash.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "triggered":
      editedImage = await new DIG.Triggered().getImage(avatar);

      attachment.setFile(editedImage).setName("triggered.gif");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    case "wanted":
      editedImage = await new DIG.Wanted().getImage(avatar);

      attachment.setFile(editedImage).setName("wanted.png");

      return await sentMessage.edit({ files: [attachment], embeds: [] }).catch(msgErrorHandler);

    default:
      logger.error(`The image named '${imageName}' does NOT exist`);

      embed
        .setColor(0xff0000)
        .setTitle("⚠️ Error")
        .setDescription("Apparently the image i'm trying to generate dosen't exist, this is a bug, this is not supposed to happen, i am sorry.")
        .addFields({ name: "Submit Report Here", value: "https://discord.gg/KxadTdz" });

      return await message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  }

  // some commands require 2 avatars, better check for the 2nd mention
  async function checkMentionedUser() {
    if (mentionedUser) return true;

    await sentMessage.edit({ content: `${message.author.username}, please mention an user, thanks`, embeds: [] }).catch(msgErrorHandler);
    return false;
  }
};
