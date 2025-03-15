const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const listsGetRandomItem = require("../../utils/listsGetRandomItem");
const mathRandomInt = require("../../utils/mathRandomInt");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  name: "hack",
  description: "Hack the mentioned user",
  cooldown: 60,
  async execute(client, message, args) {
    if (message.mentions.members.first() == null) {
      try {
        return await message.reply("You need to **mention** an user, else who do i hack?");
      } catch (error) {
        return;
      }
    }

    const member = message.mentions.members.first().user;
    const messageAuthor = message.author.username;

    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT hackCooldown FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, message.author.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!row) {
      try {
        return await message.reply("User hacking has failed, try again later");
      } catch (error) {
        return;
      }
    }

    const now = Date.now();
    const cooldownAmount = this.cooldown * 1000;
    const lastCooldown = row.hackCooldown;
    const expirationTime = lastCooldown + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = Math.floor(expirationTime / 1000);
      const hackMessageEmbed = new EmbedBuilder()
        .setColor(0x000000)
        .setDescription("Better wait **<t:" + timeLeft + ":R>** before hacking again, you might be found by the FBI");

      try {
        return await message.reply({ embeds: [hackMessageEmbed] });
      } catch (error) {
        return;
      }
    }

    const imageFile = new AttachmentBuilder("./media/hackerMan.jpg");
    const hackMessageEmbed = new EmbedBuilder()
      .setColor(0x990000)
      .setDescription(
        [
          "```diff",
          "\n",
          "DiversityBOT's magic command prompt!",
          "\n",
          "\n",
          "\n",
          "\n",
          "\n",
          "> hack -u ",
          member.username,
          "\n",
          "```",
        ].join("")
      )
      .setThumbnail("attachment://hackerMan.jpg");

    var sentMessage;
    try {
      sentMessage = await message.reply({ embeds: [hackMessageEmbed], files: [imageFile] });
    } catch (error) {
      return;
    }

    await new Promise((resolve, reject) => {
      client.database.run(
        "UPDATE User SET hackCooldown = ? WHERE serverId = ? AND userId = ?",
        [now, message.guild.id, message.author.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▖] Injecting Brownware...",
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▘] Brownware injected, time to hack!",
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▝] Getting Discord account token...",
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    const hackcmdTokenRandom = mathRandomInt(1000000000000000, 9007199254740991);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▗] Discord login token: " + hackcmdTokenRandom,
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▖] Getting IP address...",
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    const hackcmdIpNumbers = [mathRandomInt(1, 255), mathRandomInt(1, 255), mathRandomInt(1, 255), mathRandomInt(1, 255)];
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▘] IP address: " +
          hackcmdIpNumbers[0] +
          "." +
          hackcmdIpNumbers[1] +
          "." +
          hackcmdIpNumbers[2] +
          "." +
          hackcmdIpNumbers[3],
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▝] Stealing all the important data...",
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▘] Stolen data: " +
          listsGetRandomItem([
            "his project source code",
            "maths book",
            "Stole his meme",
            "I stole his 1 BTC",
            "Browser history",
            "His photos :eyes:",
            "wtf is this",
            "A way to use Black Holes?",
            "I found the plan the invade Russia?",
            "I found super secret NASA files",
            "A secret project for Mars?",
            "wtf did i found!?",
            "I found +18 images :eyes:",
            "This guys has over 500GB of anime girls",
            'I found a game called "Sex with Stalin"',
            "I found the secret about Area 51",
            "This guys has cringe memes",
            ":eyes:",
          ]),
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▖] Exploiting coords using Nocom...",
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    const hackcmdCoordsX = mathRandomInt(-30000000, 30000000);
    const hackcmdCoordsZ = mathRandomInt(-30000000, 30000000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▘] House coords: X: " + hackcmdCoordsX + ", Z: " + hackcmdCoordsZ,
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▝] Hacking all important accounts...",
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▗] Hacked account: " +
          listsGetRandomItem([
            "Instagram",
            "School",
            "Youtube",
            "Twitch",
            "Discord",
            "Reddit",
            "Minecraft",
            "Roblox",
            "Steam",
            "PornHub",
            "Reddit",
          ]),
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▖] Executing remote code using Log4j exploit...",
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▘] The remote code has been executed",
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▝] Changing his Desktop background to: " +
          listsGetRandomItem([
            "a famous art",
            "a big ass",
            "something of secret",
            "his mum",
            "his dog",
            "+18 imgs :eyes:",
            "his other girlfriend",
            "a secret project",
            "a random girl on insta",
            "Obama",
          ]),
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▗] Changed desktop background :trollolol:",
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▖] Opening the '+18' folder...",
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▘] I found: " +
          listsGetRandomItem([
            "a damn...no comment...",
            "a lot of Hentai :eyes:",
            "nothing!",
            "the popbob sex dupe :eyes:",
            "something!",
            "his secret girlfriend :eyes:",
            "+18 images :eyes:",
            "Minecraft porn? wtf",
            "Sexy girls! :eyes:",
            "A LOT OF HOT ANIME GIRLS! :eyes:",
          ]),
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▝] Sending all the data to: " + messageAuthor,
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▗] Reporting this user to Discord immediately...",
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> [▖] Sending found +18 files to the FBI...",
        "\n",
        "```",
      ].join("")
    );
    try {
      await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }

    await delay(2000);
    hackMessageEmbed.setColor(0x33cc00);
    hackMessageEmbed.setDescription(
      [
        "```diff",
        "\n",
        "DiversityBOT's magic command prompt!",
        "\n",
        "\n",
        "\n",
        "\n",
        "\n",
        "> " + member.username + " has been hacked and reported!",
        "\n",
        "```",
      ].join("")
    );
    try {
      return await sentMessage.edit({ embeds: [hackMessageEmbed] });
    } catch (error) {
      return;
    }
  },
};
