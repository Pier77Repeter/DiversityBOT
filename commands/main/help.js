const {
  StringSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
  AttachmentBuilder,
  EmbedBuilder,
  ComponentType,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "Displays the help message including all commands",
  async execute(client, message, args) {
    const helpMenu = new StringSelectMenuBuilder()
      .setCustomId("menu-help-helpMenu")
      .setPlaceholder("Click to navigate through the menu!")
      .setMaxValues(1)
      .setMinValues(1)
      .setDisabled(false)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setValue("menuOption-help-helpMenu-fun_&_games")
          .setLabel("Fun & Games")
          .setEmoji("🎮")
          .setDescription("Fun commands")
          .setDefault(false),
        new StringSelectMenuOptionBuilder()
          .setValue("menuOption-help-helpMenu-music")
          .setLabel("Music")
          .setEmoji("🎵")
          .setDescription("Music commands")
          .setDefault(false),
        new StringSelectMenuOptionBuilder()
          .setValue("menuOption-help-helpMenu-economy")
          .setLabel("Economy")
          .setEmoji("⚖️")
          .setDescription("Economy commands")
          .setDefault(false),
        new StringSelectMenuOptionBuilder()
          .setValue("menuOption-help-helpMenu-img")
          .setLabel("Image")
          .setEmoji("📸")
          .setDescription("Image commands")
          .setDefault(false),
        new StringSelectMenuOptionBuilder()
          .setValue("menuOption-help-helpMenu-utility")
          .setLabel("Utility")
          .setEmoji("🧰")
          .setDescription("Utility commands")
          .setDefault(false),
        new StringSelectMenuOptionBuilder()
          .setValue("menuOption-help-helpMenu-community")
          .setLabel("Community")
          .setEmoji("🌍")
          .setDescription("Community commands")
          .setDefault(false)
      );
    const helpMenuRow = new ActionRowBuilder().addComponents(helpMenu);

    const imageFile = new AttachmentBuilder("./media/DVC_highquality.jpg");

    const helpMessageEmbed = new EmbedBuilder()
      .setColor("#33cc00")
      .setTitle("📖 Help menu:")
      .setDescription(
        [
          'Hello there! I\'m DiversityBOT, a totally "normal" Discord Bot',
          "Feel free to look at all my commands by using the menu below",
          "Remember to give me all the needed permissions to interact, else some features wont work corretly",
          "Important commands: **d!help**, **/help**",
          "More commands will come soon. Please, be patient ;)",
          "", // for jumping down 2 times
          "Bot current version: **2.0**",
          "Support me by **joining in the discord: https://discord.gg/KxadTdz**",
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
      sentMessage = await message.reply({ embeds: [helpMessageEmbed], files: [imageFile], components: [helpMenuRow] });
    } catch (error) {
      return;
    }

    const menuCollector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 180_000,
    });

    menuCollector.on("collect", async (menuInteraction) => {
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

      if (menuInteraction.customId === "menu-help-helpMenu") {
        switch (menuInteraction.values[0]) {
          case "menuOption-help-helpMenu-fun_&_games":
            menuCollector.resetTimer();

            const helpCategoryFunMessageEmbed = new EmbedBuilder()
              .setColor("00cccc")
              .setTitle("🎮 Fun & Games section:")
              .setDescription(
                [
                  "**d!event** - Displays ongoing Bot event",
                  "**d!8ball** - Ask a question to me",
                  "**d!say <message>** - Better message with Embed",
                  "**d!kill <@user>** - Kill mentioned user with funny image",
                  "**d!snipe** - To snipe to latest deleted message",
                  "**d!rate <message>** - I'll rate 0 to 10 whatever you say",
                  "**d!rps <@user>** - Play Rock Paper Scissors game pvp",
                  "**d!stealemoji <emoji>** - Converts the emoji into png/gif",
                  "**d!nuke <location or @user>** - You decide if you want to launch the nuke.",
                  "**d!meme <sub name> (optional)** - Takes random meme from Reddit",
                  "**d!rep** or **d!rep <user>** - Check your reputation or mentioned user's rep",
                  "**d!hack <@user>** - Hack the mentioned user",
                  "**d!battle <@user>** - Start an epik battle",
                  "**d!pp <@user>** - Check mentioned user's pp",
                  "**d!roast <@user>** - To roast someone >:)",
                  "**d!ship <@user>** - See how much you love the mentioned user",
                  "**d!troll <@user>** - To troll the mentioned user",
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
                  "**d!scredits** or **d!scredits <user>** - To check credits score",
                  "**d!xp** - See your current xp",
                  "**d!level** - See your current level",
                  "**d!lxpb** - See the server XP leaderboard (levels)",
                  "**d!adopt <user>** - To adopt a new pet",
                  "**d!unadopt <user>** - To leave your pet",
                  "**d!pet** - Check your pet's stats",
                  "**d!petvisit** - Bring your pet to the vet",
                  "**d!petplay** - Play with your pet",
                  "**d!petfeed** - Feed your pet",
                  "**d!petdrink** - Give water to your pet",
                ].join("\n")
              );

            try {
              await menuInteraction.update({
                embeds: [helpMessageEmbed, helpCategoryFunMessageEmbed],
                components: [helpMenuRow],
              });
            } catch (error) {
              return;
            }
            break;
          case "menuOption-help-helpMenu-music":
            menuCollector.resetTimer();

            const helpCategoryMusicMessageEmbed = new EmbedBuilder()
              .setColor("00cccc")
              .setTitle("🎵 Music section:")
              .setDescription(
                [
                  "**You must be in a voice channel!**",
                  "",
                  "**d!play <song author - song name>** - Play a song from SoundCloud",
                  "**d!stop** - Stops everything and leave",
                  "**d!queue** - See the songs in queue",
                  "**d!np** - See the current playing song",
                  "**d!pause** - Pause the current song",
                  "**d!resume** - Resume the current song",
                  "**d!volume** - Chose the music volume, 0 to 100",
                  "**d!skip** - Skip the current song",
                  "**d!back** - Play the previous song",
                  "**d!loop** - Loops the current song",
                  "**d!lq** - Loops the whole queue",
                  // need to be rewritten
                  "**d!lyric** - Search a song lyric",
                ].join("\n")
              );

            try {
              await menuInteraction.update({
                embeds: [helpMessageEmbed, helpCategoryMusicMessageEmbed],
                components: [helpMenuRow],
              });
            } catch (error) {
              return;
            }
            break;
          case "menuOption-help-helpMenu-economy":
            menuCollector.resetTimer();

            const helpCategoryEconomyMessageEmbed = new EmbedBuilder()
              .setColor("00cccc")
              .setTitle("⚖️ Economy section:")
              .setDescription(
                [
                  "**d!lb** - To see the server leaderboard",
                  "**d!use** - Shows the list of usable items",
                  "**d!daily** - To get your daily money",
                  "**d!dupe** - To dupe money",
                  "**d!work** - Work to get some money",
                  "**d!beg** - To beg some money",
                  "**d!search** - You search for some money, you must be lucky ;)",
                  "**d!deposit <amount>** - To deposit your money in the bank",
                  "**d!withdraw <amount>** - To take your money from the bank",
                  "**d!give <user> <amount>** - To give mentioned member some money",
                  "**d!bal** or **d!bal <user>** - To see how much money is in your bank",
                  "**d!rob <user>** - To rob someone",
                  "**d!crime** - To commit a crime",
                  "**d!shop** - To see the shop",
                  "**d!inv** - To see your inventory",
                  "**d!bucket** - To see your bucket for fishes",
                  "**d!buy <item id/name>** - To buy an item from the shop",
                  "**d!sell <item id/name>** - To sell an item",
                  "**d!fish** - To start fishing",
                  "**d!add <user> <amount>** - To add money (Only admin)",
                  "**d!remove <user> <amount>** - To remove money (Only admin)",
                  "**d!hl** - Highlow game",
                  "**d!pv** - Post a video on YouTube",
                  "**d!pm** - Post a meme on Reddit",
                  "**d!roulette <amount>** - Play the roulette",
                  "**d!mine** - To go mine",
                  "**d!hunt** - Kill some preys",
                ].join("\n")
              );

            try {
              await menuInteraction.update({
                embeds: [helpMessageEmbed, helpCategoryEconomyMessageEmbed],
                components: [helpMenuRow],
              });
            } catch (error) {
              return;
            }
            break;
          case "menuOption-help-helpMenu-img":
            menuCollector.resetTimer();

            const helpCategoryImgMessageEmbed = new EmbedBuilder()
              .setColor("00cccc")
              .setTitle("📸 Image section:")
              .setDescription(
                [
                  "**d!delete** or **d!delete <user>**",
                  "**d!slap <user>**",
                  "**d!triggered** or **d!triggered <user>**",
                  "**d!kiss <user>**",
                  "**d!spank <user>**",
                  "**d!monster <user>**",
                  "**d!jail** or **d!jail <user>**",
                  "**d!gay** or **d!gay <user>**",
                  "**d!grey** or **d!grey <user>**",
                  "**d!invert** or **d!invert <user>**",
                  "**d!sepia** or **d!sepia <user>**",
                  "**d!ads** or **d!ads <user>**",
                  "**d!affect** or ** d!affect <user>**",
                  "**d!beautiful** or **d!beautiful <user>**",
                  "**d!paint** or **d!paint <user>**",
                  "**d!wtfs** or **d!wtfs <user>**",
                  "**d!blackdiscord** or **d!blackdiscord <user>**",
                  "**d!discord** or **d!discord <user>**",
                  "**d!facepalm** or **d!facepalm <user>**",
                  "**d!hitla** or **d!hitla <user>**",
                  "**d!karaba** or **d!karaba <user>**",
                  "**d!mms** or **d!mms <user>**",
                  "**d!notstonks** or **d!notstonks <user>**",
                  "**d!poutine** or **d!poutine <user>**",
                  "**d!rip** or **d!rip <user>**",
                  "**d!stonk** or **d!stonk <user>**",
                  "**d!tatoo** or **d!tatoo <user>**",
                  "**d!thomas** or **d!thomas <user>**",
                  "**d!trash** or **d!trash <user>**",
                  "**d!circle** or **d!circle <user>**",
                  "**d!stonk** or **d!stonk <user>**",
                  "**d!2stonk <user>**",
                  "**d!notstonk** or **d!notstonk <user>**",
                ].join("\n")
              );

            try {
              await menuInteraction.update({
                embeds: [helpMessageEmbed, helpCategoryImgMessageEmbed],
                components: [helpMenuRow],
              });
            } catch (error) {
              return;
            }
            break;
          case "menuOption-help-helpMenu-utility":
            menuCollector.resetTimer();

            const helpCategoryUtilityMessageEmbed = new EmbedBuilder()
              .setColor("00cccc")
              .setTitle("🧰 Utility section:")
              .setDescription(
                [
                  "**/help** - Check all the slash commands",
                  "**d!setup** - To configurate the Bot (Only admin)",
                  "**d!news** - To see news and changelogs",
                  "**d!ping** - To see the Bot ping (All 3 servers)",
                  "**d!warn <user>** - To warn a member (Only admin)",
                  "**d!warns <user>** - Check member warns (Only admin)",
                  "**d!clearwarns <user>** - Clear the warns (Only admin)",
                  "**d!mute <user>** - Mute a member (Only admin)",
                  "**d!clean <amount>** - To clean channels (Only admin, max 99 messages)",
                  "**d!kick <user>** - Kick mentioned user (Only admin)",
                  "**d!ban <user>** - Ban mentioned user (Only admin)",
                  "**d!stats** or **d!stats <user>** - To see your stats",
                  "**d!server** - Get information about the server",
                  "**d!poll <message>** - Create a simple poll",
                  "**d!3poll** - Create a triple poll",
                  "**d!calc** - Start the calculator",
                  "**d!code** - To make better code messages",
                  "**d!link** - Get the link to invite me",
                  "**d!credits** - Get all the credits",
                  "**d!status** - Check main server stats",
                ].join("\n")
              );

            try {
              await menuInteraction.update({
                embeds: [helpMessageEmbed, helpCategoryUtilityMessageEmbed],
                components: [helpMenuRow],
              });
            } catch (error) {
              return;
            }
            break;

          case "menuOption-help-helpMenu-community":
            menuCollector.resetTimer();

            const helpCategoryCommunityMessageEmbed = new EmbedBuilder()
              .setColor("00cccc")
              .setTitle("🌍 Community section:")
              .setDescription(
                [
                  "**This section will change often**",
                  "You can suggest your own command at: https://discord.gg/KxadTdz",
                  "\n",
                  "**d!jm** - For Java moment",
                  "**d!hm** - Hausemaster moment",
                  "**d!canny** - Play canny the game",
                  "**d!uncanny** - Same game but uncanny version",
                ].join("\n")
              );

            try {
              await menuInteraction.update({
                embeds: [helpMessageEmbed, helpCategoryCommunityMessageEmbed],
                components: [helpMenuRow],
              });
            } catch (error) {
              return;
            }
            break;
        }
      }
    });

    menuCollector.on("end", async () => {
      helpMenu.setPlaceholder("Menu disabled, type again d!help");
      helpMenu.setDisabled(true);

      try {
        return await sentMessage.edit({
          embeds: [helpMessageEmbed],
          components: [helpMenuRow],
        });
      } catch (error) {
        return;
      }
    });
  },
};
