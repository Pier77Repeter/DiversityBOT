const {
  StringSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
  AttachmentBuilder,
  EmbedBuilder,
  ComponentType,
  MessageFlags,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "Displays the help message including all commands",
  async execute(client, message, args) {
    const menuHelp = new StringSelectMenuBuilder()
      .setCustomId("menu-help-menuHelp")
      .setPlaceholder("Click to navigate through the menu!")
      .setMaxValues(1)
      .setMinValues(1)
      .setDisabled(false)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          // format is menuOption-<commandName>-<menuName>-<optionName>
          .setValue("menuOption-help-menuHelp-fun_&_games")
          .setLabel("Fun & Games")
          .setEmoji("🎮")
          .setDescription("Fun commands")
          .setDefault(false),
        new StringSelectMenuOptionBuilder()
          .setValue("menuOption-help-menuHelp-music")
          .setLabel("Music")
          .setEmoji("🎵")
          .setDescription("Music commands")
          .setDefault(false),
        new StringSelectMenuOptionBuilder()
          .setValue("menuOption-help-menuHelp-economy")
          .setLabel("Economy")
          .setEmoji("⚖️")
          .setDescription("Economy commands")
          .setDefault(false),
        new StringSelectMenuOptionBuilder()
          .setValue("menuOption-help-menuHelp-img")
          .setLabel("Image")
          .setEmoji("📸")
          .setDescription("Image commands")
          .setDefault(false),
        new StringSelectMenuOptionBuilder()
          .setValue("menuOption-help-menuHelp-utility")
          .setLabel("Utility")
          .setEmoji("🧰")
          .setDescription("Utility commands")
          .setDefault(false),
        new StringSelectMenuOptionBuilder()
          .setValue("menuOption-help-menuHelp-community")
          .setLabel("Community")
          .setEmoji("🌍")
          .setDescription("Community commands")
          .setDefault(false)
      );
    const actionRow = new ActionRowBuilder().addComponents(menuHelp);

    const imageFile = new AttachmentBuilder("./media/DVC_highquality.jpg");

    const embed = new EmbedBuilder()
      .setColor(0x33cc00)
      .setTitle("📖 Help menu")
      .setDescription(
        [
          '👋 Hello there! I\'m DiversityBOT, a totally "normal" Discord Bot!',
          "Feel free to look at aalllll of my commands by using the menu below",
          "Remember to give me all the needed permissions, else some features may not work properly",
          "Important commands: **d!help**, **/help**",
          "More commands will come soon. Please, be patient ;)",
          "", // for jumping down 2 times
          "Bot current version: **2.0.3**",
          "Support me by **joining in here: https://discord.gg/KxadTdz**",
        ].join("\n")
      )
      .setThumbnail("attachment://DVC_highquality.jpg")
      .setFields(
        {
          name: "📰 New updates:",
          value: "Release 2.0, type **d!news** for more!",
          inline: false,
        },
        {
          name: "🎉 Ongoing event: None",
          value: "More info about events in the Discord server!",
          inline: false,
        }
      )
      .setFooter({ text: "DiversityBOT© 2021-2025", iconURL: "attachment://DVC_highquality.jpg" });

    var sentMessage;

    try {
      sentMessage = await message.reply({ embeds: [embed], files: [imageFile], components: [actionRow] });
    } catch (error) {
      return;
    }

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 180_000,
    });

    collector.on("collect", async (menuInteraction) => {
      if (menuInteraction.user.id !== message.author.id) {
        try {
          return await menuInteraction.reply({
            content: "This menu isn't for you, just type d!help",
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          return;
        }
      }

      collector.resetTimer();
      const menuOptionEmbed = new EmbedBuilder();

      if (menuInteraction.customId === "menu-help-menuHelp") {
        switch (menuInteraction.values[0]) {
          case "menuOption-help-menuHelp-fun_&_games":
            menuOptionEmbed
              .setColor(0x00cccc)
              .setTitle("🎮 Fun & Games section:")
              .setDescription(
                [
                  "**d!event** - Displays ongoing Bot event",
                  "**d!8ball** - Ask a question to me",
                  "**d!say <message>** - Better message with Embed",
                  "**d!kill <@user>** - Kill mentioned user with funny image",
                  "**d!snipe** - Snipe to latest deleted message",
                  "**d!rate <message>** - I'll rate 0 to 10 whatever you say",
                  "**d!rps <@user>** - Play Rock Paper Scissors game pvp",
                  "**d!stealemoji <emoji>** - Converts the emoji into png/gif",
                  "**d!nuke <location or @user>** - You decide if you want to launch the nuke.",
                  "**d!meme <sub name> (optional)** - Takes random meme from Reddit",
                  "**d!rep** or **d!rep <@user>** - Check your reputation or mentioned user's rep",
                  "**d!hack <@user>** - Hack the mentioned user",
                  "**d!battle <@user>** - Start an epik battle",
                  "**d!pp <@user>** - Check mentioned user's pp",
                  "**d!roast <@user>** - Let me roast the mentioned user >:)",
                  "**d!ship <@user>** - See how much you love the mentioned user",
                  "**d!troll <@user>** - Troll the mentioned user with a funny face",
                  "**d!urban <word/pharse>** - Search the content in the Urban dictionary",
                  "**d!mcjs <server ip>** - Display Minecraft Java server stats",
                  "**d!2048** - Play 2048 game, but on Discord",
                  "**d!connect4 <@user>** - Play Connect4 with mentioned user",
                  "**d!emojify** - Converts your text into emojis",
                  "**d!findemoji** - Find the right emoji",
                  "**d!flood** - Fill the board with 1 color",
                  "**d!hangman** - Classic guess the word or dead game",
                  "**d!matchpairs** - Find the emoji pairs",
                  "**d!minesweeper** - Play the game nobody understands",
                  "**d!pokeguess** - Guess the pokemon the the picture",
                  "**d!slots** - Simple slot machine",
                  "**d!snake** - Play the snake game on Discord",
                  "**d!trivia** - Guess the correct answers",
                  "**d!ttt <@user>** - Play tic tac toe with the mentioned user",
                  "**d!wyr** - Would you rather do this or that",
                  "**d!akinator** - And i'll try to guess your character",
                  "**d!sctest** - Start the Social Credits test",
                  "**d!scredits** or **d!scredits <@user>** - Check credits score",
                  "**d!xp** - See your current xp",
                  "**d!level** - See your current level",
                  "**d!lxpb** - See the server XP leaderboard (levels)",
                  "**d!adopt <@user>** - Adopt a new 'pet'",
                  "**d!unadopt <@user>** - Abandon your 'pet'",
                  "**d!pet** - Check your pet's stats",
                  "**d!petvisit** - Bring your pet to the vet",
                  "**d!petplay** - Play with your pet",
                  "**d!petfeed** - Feed your pet",
                  "**d!petdrink** - Give water to your pet",
                ].join("\n")
              );

            try {
              await menuInteraction.update({
                embeds: [embed, menuOptionEmbed],
                components: [actionRow],
              });
            } catch (error) {
              return;
            }
            break;
          case "menuOption-help-menuHelp-music":
            menuOptionEmbed
              .setColor(0x00cccc)
              .setTitle("🎵 Music section:")
              .setDescription(
                [
                  "**You must be in a voice channel!**",
                  "",
                  "**d!play <song author - song name>** - Play a song from SoundCloud",
                  "**d!stop** - Stops everything and leave",
                  "**d!queue** - See the songs in queue",
                  "**d!nowplaying** - See the current playing song",
                  "**d!pause** - Pause the current song",
                  "**d!resume** - Resume the current song",
                  "**d!volume** - Chose the music volume, 0 to 100",
                  "**d!skip** - Skip the current song",
                  "**d!back** - Play the previous song",
                  "**d!loop** - Loops the current song",
                  "**d!loopqueue** - Loops the whole queue",
                ].join("\n")
              );

            try {
              await menuInteraction.update({
                embeds: [embed, menuOptionEmbed],
                components: [actionRow],
              });
            } catch (error) {
              return;
            }
            break;
          case "menuOption-help-menuHelp-economy":
            menuOptionEmbed
              .setColor(0x00cccc)
              .setTitle("⚖️ Economy section:")
              .setDescription(
                [
                  "**d!balance** - See how much money the user has",
                  "**d!lb** - See the richest users in the server",
                  "**d!use** - Shows the list of usable items",
                  "**d!inventory** - See user's inventory",
                  "**d!bucket** - See user's bucket with the fishes",
                  "**d!shop** - See the DiversityShop",
                  "**d!deposit <amount>** - Deposit your money in the bank",
                  "**d!withdraw <amount>** - Withdraw your money from the bank",
                  "**d!give <@user> <amount>** - Give money to mentioned user",
                  "**d!debts** - Check user debts",
                  "**d!buy <item name>** - Buy an item from the shop",
                  "**d!sell <item name>** - Sell an item from your inventory",
                  "**d!add <@user> <amount>** - Add money to an user (Only admin)",
                  "**d!remove <@user> <amount>** - Remove money to an user (Only admin)",
                  "**d!daily** - Claim your daily reward",
                  "**d!dupe** - Earn money by duping money",
                  "**d!search** - Search for money around the Minecraft world",
                  "**d!jobs** - See the list of jobs you can do",
                  "**d!work** - Work to get some money",
                  "**d!beg** - Beg for money",
                  "**d!crime** - Commit a crime",
                  "**d!hl** - Play the highlow game",
                  "**d!pm** - Post a meme on Reddit",
                  "**d!pv** - Post a video on YouTube",
                  "**d!fish** - Go fishing",
                  "**d!mine** - Mine for ores",
                  "**d!hunt** - Hunt in the forest for preys",
                  "**d!rob <@user>** - Rob the mentioned user",
                  "**d!roulette <amount>** - Play the roulette",
                ].join("\n")
              );

            try {
              await menuInteraction.update({
                embeds: [embed, menuOptionEmbed],
                components: [actionRow],
              });
            } catch (error) {
              return;
            }
            break;
          case "menuOption-help-menuHelp-img":
            menuOptionEmbed
              .setColor(0x00cccc)
              .setTitle("📸 Image section:")
              .setDescription(
                [
                  "**d!ad** or **d!affect <@user>**",
                  "**d!affect** or **d!affect <@user>**",
                  "**d!batslap <@user>**",
                  "**d!beautiful** or **d!beautiful <@user>**",
                  "**d!bed <@user>**",
                  "**d!blink <@user>**",
                  "**d!blur** or **d!blur <@user>**",
                  "**d!bobross** or **d!bobross <@user>**",
                  "**d!circle** or **d!circle <@user>**",
                  "**d!clown** or **d!clown <@user>**",
                  "**d!confusedstonk** or **d!confusedstonk <@user>**",
                  "**d!deepfry** or **d!deepfry <@user>**",
                  "**d!delete** or **d!delete <@user>**",
                  "**d!denoise** or **d!denoise <@user>**",
                  "**d!discordblack** or **d!discordblack <@user>**",
                  "**d!discordblue** or **d!discordblue <@user>**",
                  "**d!doublestonk** or **d!doublestonk <@user>**",
                  "**d!facepalm** or **d!facepalm <@user>**",
                  "**d!gay** or **d!gay <@user>**",
                  "**d!greyscale** or **d!greyscale <@user>**",
                  "**d!heartbreaking** or **d!heartbreaking <@user>**",
                  "**d!hitler** or **d!hitler <@user>**",
                  "**d!invert** or **d!invert <@user>**",
                  "**d!jail** or **d!jail <@user>**",
                  "**d!karaba** or **d!karaba <@user>**",
                  "**d!kiss <@user>**",
                  "**d!mikkelsen** or **d!mikkelsen <@user>**",
                  "**d!mirrorhor** or **d!mirrorhor <@user>**",
                  "**d!mirrorver** or **d!mirrorver <@user>**",
                  "**d!mms** or **d!mms <@user>**",
                  "**d!notstonk** or **d!notstonk <@user>**",
                  "**d!poutine** or **d!poutine <@user>**",
                  "**d!rip** or **d!rip <@user>**",
                  "**d!sepia** or **d!sepia <@user>**",
                  "**d!syder** or **d!syder <@user>**",
                  "**d!spank <@user>**",
                  "**d!stonk** or **d!stonk <@user>**",
                  "**d!tatoo** or **d!tatoo <@user>**",
                  "**d!thomas** or **d!thomas <@user>**",
                  "**d!trash** or **d!trash <@user>**",
                  "**d!triggered** or **d!triggered <@user>**",
                  "**d!wanted** or **d!wanted <@user>**",
                ].join("\n")
              );

            try {
              await menuInteraction.update({
                embeds: [embed, menuOptionEmbed],
                components: [actionRow],
              });
            } catch (error) {
              return;
            }
            break;
          case "menuOption-help-menuHelp-utility":
            menuOptionEmbed
              .setColor(0x00cccc)
              .setTitle("🧰 Utility section:")
              .setDescription(
                [
                  "**d!config** - See Bot's configurations",
                  "**d!setup <configName>** - Configure the Bot (Only admin)",
                  "**d!status** - Check Bot's stats",
                  "**d!news** - See Bot news and changelogs",
                  "**d!link** - Get the link to invite me",
                  "**d!credits** - Get all the credits",
                  "**d!ping** - Example command (see on GitHub)",
                  "**d!stats** or **d!stats <@user>** - See your stats",
                  "**d!server** - Get information about the server",
                  "**d!modlog <#channel>** - Set the channel for logging mod actions (Only admin)",
                  "**d!clean <amount>** - Remove an amount of messages from a channel (Only admin)",
                  "**d!kick <@user> <reason>** - Kick mentioned user (Only admin)",
                  "**d!ban <@user> <reason>** - Ban mentioned user (Only admin)",
                  "**d!unban <userId> <reason>** - Unban the user from the server (Only admin)",
                  "**d!mute <@user> <minutes> <reason>** - Mute a member (Only admin)",
                  "**d!unmute <@user> <reason>** - Unmute a member (Only admin)",
                  "**d!warn <@user> <reason>** - Warn a member (Only admin)",
                  "**d!warns <@user>** - Check or clear member's warns (Only admin)",
                ].join("\n")
              );

            try {
              await menuInteraction.update({
                embeds: [embed, menuOptionEmbed],
                components: [actionRow],
              });
            } catch (error) {
              return;
            }
            break;

          case "menuOption-help-menuHelp-community":
            menuOptionEmbed
              .setColor(0x00cccc)
              .setTitle("🌍 Community section:")
              .setDescription(
                [
                  "**This section will often change due to new commands being, added, changed or removed**",
                  "You can suggest your own command at: https://discord.gg/KxadTdz",
                  "",
                  "**d!hm** - Hausemaster moment",
                  "**d!jm** - Java moment",
                  "**d!canny** - Play canny the game",
                  "**d!uncanny** - Same game but uncanny version",
                ].join("\n")
              );

            try {
              await menuInteraction.update({
                embeds: [embed, menuOptionEmbed],
                components: [actionRow],
              });
            } catch (error) {
              return;
            }
            break;
        }
      }
    });

    collector.on("end", async () => {
      menuHelp.setPlaceholder("Menu disabled, type again d!help");
      menuHelp.setDisabled(true);

      try {
        return await sentMessage.edit({
          embeds: [embed],
          components: [actionRow],
        });
      } catch (error) {
        return;
      }
    });
  },
};
