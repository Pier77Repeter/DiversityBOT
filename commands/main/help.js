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
          "\n",
          "Feel free to look at all my commands by using the menu below",
          "\n",
          "Remember to give me all the needed permissions to interact, else some features wont work corretly",
          "\n",
          "Important commands: **d!help**, **/help**",
          "\n",
          "More commands will come soon. Please, be patient ;)",
          "\n",
          "\n",
          "Bot current version: **2.0**",
          "\n",
          "Support me by **joining in the discord: https://discord.gg/KxadTdz**",
        ].join("")
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
                  // rewroten commands
                  "**d!event** - Displays ongoing Bot event",
                  "\n",
                  "**d!8ball** - Ask a question to me",
                  "\n",
                  "**d!say <message>** - Better message with Embed",
                  "\n",
                  "**d!kill <@user>** - Kill mentioned user with funny image",
                  "\n",
                  "**d!snipe** - To snipe to latest deleted message",
                  "\n",
                  "**d!rate <message>** - I'll rate 0 to 10 whatever you say",
                  "\n",
                  "**d!rps <@user>** - Play Rock Paper Scissors game pvp",
                  "\n",
                  "**d!stealemoji <emoji>** - Converts the emoji into png/gif",
                  "\n",
                  "**d!nuke <location or @user>** - You decide if you want to launch the nuke.",
                  "\n",
                  "**d!meme <sub name> (optional)** - Takes random meme from Reddit",
                  "\n",
                  "**d!rep** or **d!rep <user>** - Check your reputation or mentioned user's rep",
                  "\n",
                  "**d!hack <user>** - Hack the mentioned user",
                  "\n",
                  "**d!battle <user>** - Start an epik battle",
                  "\n",
                  // needs to be rewritten
                  "**d!akinator** - And i'll try to guess your character",
                  "\n",
                  "**d!snake** - Play snake game like on Google",
                  "\n",
                  "**d!ttt <user>** - Play tic tac toe with an user",
                  "\n",
                  "**d!roast <user>** - To roast someone >:)",
                  "\n",
                  "**d!ship <user>** - See how much you love the mentioned user",
                  "\n",
                  "**d!troll <user>** - To troll the mentioned user",
                  "\n",
                  "**d!sctest** - Start the Social Credits test",
                  "\n",
                  "**d!scredits** or **d!scredits <user>** - To check credits score",
                  "\n",
                  "**d!canny** - Play canny the game",
                  "\n",
                  "**d!uncanny** - Same game but uncanny version",
                  "\n",
                  "**d!pp <user>** - To check mentioned user's pp",
                  "\n",
                  "**d!mcip <server ip>** - Display a minecraft server stats",
                  "\n",
                  "**d!mcbip <server ip>** - Display a minecraft  bedrock server stats",
                  "\n",
                  "**d!adopt <user>** - To adopt a new pet",
                  "\n",
                  "**d!unadopt <user>** - To leave your pet",
                  "\n",
                  "**d!pet** - To check your pet's stats",
                  "\n",
                  "**d!petvisit** - To bring your pet to the vet",
                  "\n",
                  "**d!petplay** - To play with your pet",
                  "\n",
                  "**d!petfeed** - To feed your pet",
                  "\n",
                  "**d!petdrink** - To give water to your pet",
                  "\n",
                  "**d!petsee <user>** - See other users pet",
                  "\n",
                  "**d!xp** - To see your current xp",
                  "\n",
                  "**d!level** - To see your current level",
                  "\n",
                  "**d!lxpb** - To see the server leaderboard (levels)",
                ].join("")
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
                  "\n",
                  "\n",
                  "**d!play <song name/url>** - To play a song",
                  "\n",
                  "**d!np** - To see the current playing song",
                  "\n",
                  "**d!queue** - To see the songs queue",
                  "\n",
                  "**d!pause** - Pause the current song",
                  "\n",
                  "**d!resume** - Resume the current song",
                  "\n",
                  "**d!stop** - Stop the music",
                  "\n",
                  "**d!volume** - Chose the music volume, 1 to 100",
                  "\n",
                  "**d!skip** - Skip the song",
                  "\n",
                  "**d!back** - Play the previous song",
                  "\n",
                  "**d!loop <on/off>** - Loop all the songs",
                  "\n",
                  "**d!lyric** - Search a song lyric",
                ].join("")
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
                  "\n",
                  "**d!use** - Shows the list of usable items",
                  "\n",
                  "**d!daily** - To get your daily money",
                  "\n",
                  "**d!dupe** - To dupe money",
                  "\n",
                  "**d!work** - Work to get some money",
                  "\n",
                  "**d!beg** - To beg some money",
                  "\n",
                  "**d!search** - You search for some money, you must be lucky ;)",
                  "\n",
                  "**d!deposit <amount>** - To deposit your money in the bank",
                  "\n",
                  "**d!withdraw <amount>** - To take your money from the bank",
                  "\n",
                  "**d!give <user> <amount>** - To give mentioned member some money",
                  "\n",
                  "**d!bal** or **d!bal <user>** - To see how much money is in your bank",
                  "\n",
                  "**d!rob <user>** - To rob someone",
                  "\n",
                  "**d!crime** - To commit a crime",
                  "\n",
                  "**d!shop** - To see the shop",
                  "\n",
                  "**d!inv** - To see your inventory",
                  "\n",
                  "**d!bucket** - To see your bucket for fishes",
                  "\n",
                  "**d!buy <item id/name>** - To buy an item from the shop",
                  "\n",
                  "**d!sell <item id/name>** - To sell an item",
                  "\n",
                  "**d!fish** - To start fishing",
                  "\n",
                  "**d!add <user> <amount>** - To add money (Only admin)",
                  "\n",
                  "**d!remove <user> <amount>** - To remove money (Only admin)",
                  "\n",
                  "**d!hl** - Highlow game",
                  "\n",
                  "**d!pv** - Post a video on YouTube",
                  "\n",
                  "**d!pm** - Post a meme on Reddit",
                  "\n",
                  "**d!roulette <amount>** - Play the roulette",
                  "\n",
                  "**d!mine** - To go mine",
                  "\n",
                  "**d!hunt** - Kill some preys",
                ].join("")
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
                  "\n",
                  "**d!slap <user>**",
                  "\n",
                  "**d!triggered** or **d!triggered <user>**",
                  "\n",
                  "**d!kiss <user>**",
                  "\n",
                  "**d!spank <user>**",
                  "\n",
                  "**d!monster <user>**",
                  "\n",
                  "**d!jail** or **d!jail <user>**",
                  "\n",
                  "**d!gay** or **d!gay <user>**",
                  "\n",
                  "**d!grey** or **d!grey <user>**",
                  "\n",
                  "**d!invert** or **d!invert <user>**",
                  "\n",
                  "**d!sepia** or **d!sepia <user>**",
                  "\n",
                  "**d!ads** or **d!ads <user>**",
                  "\n",
                  "**d!affect** or ** d!affect <user>**",
                  "\n",
                  "**d!beautiful** or **d!beautiful <user>**",
                  "\n",
                  "**d!paint** or **d!paint <user>**",
                  "\n",
                  "**d!wtfs** or **d!wtfs <user>**",
                  "\n",
                  "**d!blackdiscord** or **d!blackdiscord <user>**",
                  "\n",
                  "**d!discord** or **d!discord <user>**",
                  "\n",
                  "**d!facepalm** or **d!facepalm <user>**",
                  "\n",
                  "**d!hitla** or **d!hitla <user>**",
                  "\n",
                  "**d!karaba** or **d!karaba <user>**",
                  "\n",
                  "**d!mms** or **d!mms <user>**",
                  "\n",
                  "**d!notstonks** or **d!notstonks <user>**",
                  "\n",
                  "**d!poutine** or **d!poutine <user>**",
                  "\n",
                  "**d!rip** or **d!rip <user>**",
                  "\n",
                  "**d!stonk** or **d!stonk <user>**",
                  "\n",
                  "**d!tatoo** or **d!tatoo <user>**",
                  "\n",
                  "**d!thomas** or **d!thomas <user>**",
                  "\n",
                  "**d!trash** or **d!trash <user>**",
                  "\n",
                  "**d!circle** or **d!circle <user>**",
                  "\n",
                  "**d!stonk** or **d!stonk <user>**",
                  "\n",
                  "**d!2stonk <user>**",
                  "\n",
                  "**d!notstonk** or **d!notstonk <user>**",
                ].join("")
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
                  "\n",
                  "**d!setup** - To configurate the Bot (Only admin)",
                  "\n",
                  "**d!news** - To see news and changelogs",
                  "\n",
                  "**d!ping** - To see the Bot ping (All 3 servers)",
                  "\n",
                  "**d!warn <user>** - To warn a member (Only admin)",
                  "\n",
                  "**d!warns <user>** - Check member warns (Only admin)",
                  "\n",
                  "**d!clearwarns <user>** - Clear the warns (Only admin)",
                  "\n",
                  "**d!mute <user>** - Mute a member (Only admin)",
                  "\n",
                  "**d!clean <amount>** - To clean channels (Only admin, max 99 messages)",
                  "\n",
                  "**d!kick <user>** - Kick mentioned user (Only admin)",
                  "\n",
                  "**d!ban <user>** - Ban mentioned user (Only admin)",
                  "\n",
                  "**d!stats** or **d!stats <user>** - To see your stats",
                  "\n",
                  "**d!server** - Get information about the server",
                  "\n",
                  "**d!poll <message>** - Create a simple poll",
                  "\n",
                  "**d!3poll** - Create a triple poll",
                  "\n",
                  "**d!calc** - Start the calculator",
                  "\n",
                  "**d!code** - To make better code messages",
                  "\n",
                  "**d!link** - Get the link to invite me",
                  "\n",
                  "**d!credits** - Get all the credits",
                  "\n",
                  "**d!status** - Check main server stats",
                ].join("")
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
                  "\n",
                  "You can suggest your own command at: https://discord.gg/KxadTdz",
                  "\n",
                  "\n",
                  "**d!jm** - For Java moment",
                  "\n",
                  "**d!hm** - Hausemaster moment",
                ].join("")
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
