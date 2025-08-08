const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const cooldownManager = require("../../utils/cooldownManager");
const delay = require("../../utils/delay");
const mathRandomInt = require("../../utils/mathRandomInt");
const listsGetRandomItem = require("../../utils/listsGetRandomItem");

module.exports = {
  name: "battle",
  description: "Starts an epik battle with the mentioned user",
  cooldown: 60,
  async execute(client, message, args) {
    try {
      if (message.mentions.members.first() == null) return await message.reply("Herr " + message.author.username + ", you need to mention an opponent!");
    } catch (error) {
      return;
    }

    const embed = new EmbedBuilder();

    const mentionedUser = message.mentions.members.first().user;
    const messageAuthor = message.author;

    const cooldown = await cooldownManager(client, message, "battleCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ Herr user, you can do another battle **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const imageFile = new AttachmentBuilder("./media/letBattleBegin.jpg");
    embed
      .setColor(0xc0c0c0)
      .setTitle("⚙️ Preparing the arena...")
      .setDescription(messageAuthor.username + " ⚔️ vs ⚔️ " + mentionedUser.username)
      .setImage("attachment://letBattleBegin.jpg");

    var sentMessage;
    try {
      sentMessage = await message.reply({ embeds: [embed], files: [imageFile] });
    } catch (error) {
      return;
    }

    await delay(3000);

    var authorHp = 100;
    var opponentHp = 100;
    var battleDamage = 0;
    var preventInfiniteLoop = 0; // i dont trust my own code O_O

    imageFile.setFile("./media/battleBegins.jpg");
    embed.setImage("attachment://battleBegins.jpg");

    try {
      await sentMessage.edit({ embeds: [embed], files: [imageFile] });
    } catch (error) {
      return;
    }

    while (preventInfiniteLoop < 100) {
      preventInfiniteLoop++;

      battleDamage = mathRandomInt(1, 30);
      opponentHp = opponentHp - battleDamage;

      if (opponentHp <= 0) {
        embed
          .setColor(0x33cc00)
          .setTitle(messageAuthor.username + " ⚔️ vs ⚔️ " + mentionedUser.username)
          .setDescription("➡️ " + messageAuthor.username + " did the final strike and destroyed " + mentionedUser.username + " for **-" + battleDamage + "HP**")
          .setFields({
            name: "❤️ Final HP:",
            value: messageAuthor.username + ": **" + authorHp + "HP**   |   " + mentionedUser.username + ": **0HP**",
          });

        try {
          await sentMessage.edit({ embeds: [embed] });
        } catch (error) {
          return;
        }

        await delay(4000);

        embed
          .setColor(0xffcc00)
          .setTitle("🏆 " + messageAuthor.username + " won!")
          .setDescription("That was a very epik fight, GGs!")
          .setImage("https://c.tenor.com/joRMjYBLsFsAAAAd/tenor.gif")
          .setFooter({ text: "ezzz" });

        try {
          return await sentMessage.edit({ embeds: [embed], files: [] });
        } catch (error) {
          return;
        }
      }

      embed
        .setColor(0x33cc00)
        .setTitle(messageAuthor.username + " ⚔️ vs ⚔️ " + mentionedUser.username)
        .setDescription(
          "➡️ " +
            messageAuthor.username +
            " " +
            listsGetRandomItem([
              "decided to ignore " + mentionedUser.username,
              "used a firework against " + mentionedUser.username,
              "dealt a finishing blow to " + mentionedUser.username,
              "vanquished " + mentionedUser.username + " with a decisive attack",
              "landed a fatal blow on " + mentionedUser.username + " with a powerful punch",
              "kicked " + mentionedUser.username + "'s ass",
              "punched " + mentionedUser.username,
              "farted on " + mentionedUser.username,
              "smashed " + mentionedUser.username,
              "said that " + mentionedUser.username + " is gay",
              "threw a rock at " + mentionedUser.username,
              "crushed " + mentionedUser.username,
              "destroyed " + mentionedUser.username,
              "literally said no to " + mentionedUser.username,
              "smacked " + mentionedUser.username + " with a hammer",
              "threw a spear at " + mentionedUser.username,
              "burned " + mentionedUser.username + " with fire dealing",
              "flipped " + mentionedUser.username + " into the ground",
              "sent " + mentionedUser.username + " to the shadow realm",
              "unleashed a swarm of bees on " + mentionedUser.username,
              "used a fishing rod to reel in " + mentionedUser.username,
              "dropped an anvil on " + mentionedUser.username + "'s head",
              "hit " + mentionedUser.username + " with a frying pan",
              "used a rubber chicken to slap " + mentionedUser.username,
              "pushed " + mentionedUser.username + " into a pit of lava",
              "flipped " + mentionedUser.username + " into the ground",
              "vaporized " + mentionedUser.username + " with a laser beam",
              "used a flying kick on " + mentionedUser.username,
              "launched " + mentionedUser.username + " into space",
              "used a super-effective attack on " + mentionedUser.username,
              "blinded " + mentionedUser.username + " with a flash grenade",
              "cursed " + mentionedUser.username + " with bad luck",
              "challenged " + mentionedUser.username + " to a dance-off and won",
              "hit " + mentionedUser.username + " with a truck",
            ]) +
            " for **-" +
            battleDamage +
            "HP**"
        )
        .setFields({
          name: "❤️ HP stats:",
          value: messageAuthor.username + ": **" + authorHp + "HP**   |   " + mentionedUser.username + ": **" + opponentHp + "HP**",
        });

      try {
        await sentMessage.edit({ embeds: [embed] });
      } catch (error) {
        return;
      }

      await delay(3000);

      battleDamage = mathRandomInt(1, 30);
      authorHp = authorHp - battleDamage;

      if (authorHp <= 0) {
        embed
          .setColor(0xff0000)
          .setTitle(messageAuthor.username + " ⚔️ vs ⚔️ " + mentionedUser.username)
          .setDescription("⬅️ " + mentionedUser.username + " did the final strike and destroyed " + messageAuthor.username + " for **-" + battleDamage + "HP**")
          .setFields({
            name: "❤️ Final HP:",
            value: messageAuthor.username + ": **0HP**   |   " + mentionedUser.username + ": **" + opponentHp + "HP**",
          });

        try {
          await sentMessage.edit({ embeds: [embed] });
        } catch (error) {
          return;
        }

        await delay(4000);

        embed
          .setColor(0xffcc00)
          .setTitle("🏆 " + mentionedUser.username + " won!")
          .setDescription("That was a very epik fight, GGs!")
          .setImage("https://c.tenor.com/joRMjYBLsFsAAAAd/tenor.gif")
          .setFooter({ text: "ezzz" });

        try {
          return await sentMessage.edit({ embeds: [embed], files: [] });
        } catch (error) {
          return;
        }
      }

      embed
        .setColor(0xff0000)
        .setTitle(messageAuthor.username + " ⚔️ vs ⚔️ " + mentionedUser.username)
        .setDescription(
          "⬅️ " +
            mentionedUser.username +
            " " +
            listsGetRandomItem([
              "decide to ignore " + messageAuthor.username,
              "used a firework against " + messageAuthor.username,
              "dealt a finishing blow to " + messageAuthor.username,
              "vanquished " + messageAuthor.username + " with a decisive attack",
              "landed a fatal blow on " + messageAuthor.username + " with a powerful punch",
              "kicked " + messageAuthor.username + "'s ass",
              "punched " + messageAuthor.username,
              "farted on " + messageAuthor.username,
              "smashed " + messageAuthor.username,
              "said that " + messageAuthor.username + " is gay",
              "threw a rock at " + messageAuthor.username,
              "crushed " + messageAuthor.username,
              "destroyed " + messageAuthor.username,
              "literally said no to " + messageAuthor.username,
              "smacked " + messageAuthor.username + " with a hammer",
              "threw a spear at " + messageAuthor.username,
              "burned " + messageAuthor.username + " with fire dealing",
              "flipped " + messageAuthor.username + " into the ground",
              "sent " + messageAuthor.username + " to the shadow realm",
              "unleashed a swarm of bees on " + messageAuthor.username,
              "used a fishing rod to reel in " + messageAuthor.username,
              "dropped an anvil on " + messageAuthor.username + "'s head",
              "hit " + messageAuthor.username + " with a frying pan",
              "used a rubber chicken to slap " + messageAuthor.username,
              "pushed " + messageAuthor.username + " into a pit of lava",
              "flipped " + messageAuthor.username + " into the ground",
              "vaporized " + messageAuthor.username + " with a laser beam",
              "used a flying kick on " + messageAuthor.username,
              "launched " + messageAuthor.username + " into space",
              "used a super-effective attack on " + messageAuthor.username,
              "blinded " + messageAuthor.username + " with a flash grenade",
              "cursed " + messageAuthor.username + " with bad luck",
              "challenged " + messageAuthor.username + " to a dance-off and won",
              "hit " + messageAuthor.username + " with a truck",
            ]) +
            " for **-" +
            battleDamage +
            "HP**"
        )
        .setFields({
          name: "❤️ HP stats:",
          value: messageAuthor.username + ": **" + authorHp + "HP**   |   " + mentionedUser.username + ": **" + opponentHp + "HP**",
        });

      try {
        await sentMessage.edit({ embeds: [embed] });
      } catch (error) {
        return;
      }

      await delay(3000);
    }
  },
};
