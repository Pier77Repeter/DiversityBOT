const { EmbedBuilder } = require("discord.js");
const cooldownManager = require("../../utils/cooldownManager");
const manageUserMoney = require("../../utils/manageUserMoney");
const mathRandomInt = require("../../utils/mathRandomInt");
const listsGetRandomItem = require("../../utils/listsGetRandomItem");

module.exports = {
  name: "beg",
  description: "Beg for money",
  cooldown: 3600,
  async execute(client, message, args) {
    const cooldown = await cooldownManager(client, message, "begCooldown", this.cooldown);
    if (cooldown == null) return;

    const embed = new EmbedBuilder();

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ Beg again in: **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (mathRandomInt(1, 4) == 1) {
      embed.setColor(0xff0000).setTitle("💸 Ignored").setDescription("You begged but nobody gave you money, try again later");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const money = mathRandomInt(20, 70);

    // take a look into utils/manageUserMoney.js
    if ((await manageUserMoney(client, message, "+", money)) == null) return;

    embed
      .setColor(0xffcc33)
      .setTitle(
        listsGetRandomItem(
          [
            "Mum",
            "Duck",
            "Pirate",
            "Brother",
            "DiversityBOT",
            "Hausemaster",
            "Drip boy",
            "Mario",
            "Luigi",
            "Amogus",
            "Discord Mod",
            "Cocaine man",
            "CEO of Crab Game",
            "Ruspa man",
            "Monke",
            "Bob",
            "Mr beast",
            "popbob",
            "Xinnie Jinpooh",
            "CEO of YouTube",
            "Marcos",
            "Jacob",
            "Lady Gaga",
            "Obama",
            "Mr Obunga",
            "Matarella",
            "Matteo Salvini",
            "FitMC",
            "Random person",
            "Man",
            "Woman",
            "Giuseppe",
            "Secret Agent",
            "Pier77Repeter",
            "Telecome Italia",
            "Tryhard",
            "Night Guardian",
            "Robot",
            "Gordon Ramsay",
            "Cannavaciulo",
            "Putin",
            "Moay",
            "Old person",
            "Kid",
            "Worker",
            "Anime boy",
            "Anime girl",
            "Gargoil",
            "Mexican guy",
          ],
          false
        )
      )
      .setDescription(
        listsGetRandomItem(
          [
            "Oh you poor little beggar, **" + money + "$**!",
            "The party was epik, here, **" + money + "$**!",
            "Thanks for the homeworks, here, **" + money + "$**!",
            "Here, have, **" + money + "$**!",
            "Oh poor boy, here **" + money + "$**!",
            "You so nice, here **" + money + "$**!",
            "Cute, here **" + money + "$**!",
            "Nice song, here **" + money + "$**!",
            "Here some money, **" + money + "$**!",
            "Congratulation!, You won **" + money + "$**!",
            "Just because i'm nice, here **" + money + "$**!",
            "Thanks for helping, here **" + money + "$**!",
            "Yes, here **" + money + "$**!",
            "I'll help you, here **" + money + "$**!",
            "Free money for you, here **" + money + "$**!",
            "Lucky, here **" + money + "$**!",
            "What a nice guy, here **" + money + "$**!",
            "Thank you for cake, here **" + money + "$**!",
            "I have some extra coins, here **" + money + "$**!",
            "Shhhhhhhh, here **" + money + "$**!",
            "You saved my cat! Here **" + money + "$**!",
            "Under the sea i found some money, here **" + money + "$**!",
            "I duped extra money, here **" + money + "$**!",
            "Thank for supporting us, here **" + money + "$**!",
            "Wow i lost, here **" + money + "$**!",
            "You won, so, here **" + money + "$**!",
            "Pssss, here **" + money + "$**!",
          ],
          false
        )
      );

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
