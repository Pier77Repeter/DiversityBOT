/*
Author: Pier77Repeter
Started project on: 21 August 2021
Copyright: DiversityBOT© 2021-2025
*/

/*
Notes:
- This is a special event file for the bot to celebrate April Fools Day.
- Only to be used on the 1st of April.
*/
(async () => {
  // default imports
  const events = require("events");
  const { exec } = require("child_process");
  const logs = require("discord-logs");
  const Discord = require("discord.js");
  const { MessageEmbed, MessageButton, MessageActionRow, Intents, Permissions, MessageSelectMenu } = require("discord.js");
  const fs = require("fs");
  let process = require("process");
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // block imports
  const os = require("os-utils");
  let URL = require("url");
  const ms = require("ms");
  let https = require("https");
  const miliConverter = require("millisecond-converter");
  const Database = require("easy-json-database");

  // define s4d components (pretty sure 90% of these arnt even used/required)
  let s4d = {
    Discord,
    fire: null,
    joiningMember: null,
    reply: null,
    player: null,
    manager: null,
    Inviter: null,
    message: null,
    notifer: null,
    checkMessageExists() {
      if (!s4d.client) throw new Error("You cannot perform message operations without a Discord.js client");
      if (!s4d.client.readyTimestamp) throw new Error("You cannot perform message operations while the bot is not connected to the Discord API");
    },
  };

  // create a new discord client
  s4d.client = new s4d.Discord.Client({
    intents: [Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)],
    partials: ["REACTION", "CHANNEL"],
  });

  // when the bot is connected say so
  s4d.client.on("ready", () => {
    console.log(s4d.client.user.tag + " is connected!");
  });

  // upon error print "Error!" and the error
  process.on("uncaughtException", function (err) {
    console.log("Error!");
    console.log(err);
  });

  // give the new client to discord-logs
  logs(s4d.client);

  // blockly code
  await s4d.client.login(process.env[String("TOKEN")]).catch((e) => {
    const tokenInvalid = true;
    const tokenError = e;
    if (e.toString().toLowerCase().includes("token")) {
      throw new Error("An invalid bot token was provided!");
    } else {
      throw new Error("Privileged Gateway Intents are not enabled! Please go to https://discord.com/developers and turn on all of them.");
    }
  });

  // keep alive, always put this before bot's status message
  const keep_alive = require("./server.js");

  // bot status
  s4d.client.on("ready", async () => {
    s4d.client.user.setPresence({
      status: "online",
      activities: [
        {
          name: "1st of April? chill today",
          type: "PLAYING",
        },
      ],
    });
  });

  s4d.client.on("messageCreate", async (s4dmessage) => {
    if (s4dmessage.author.bot) {
      return;
    }

    /*
    D!SHUTDOWN
    */
    if ((s4dmessage.content.toUpperCase() || "").startsWith("D!SHUTDOWN" || "") && s4dmessage.author.id == "724990112030654484") {
      s4dmessage
        .reply({
          content: String("Okay, shutting down..."),
          allowedMentions: {
            repliedUser: true,
          },
        })
        .then(async (s4dfrost_real_reply) => {
          await delay(Number(2) * 1000);
          s4dmessage.delete();
          s4dfrost_real_reply.delete();
          await delay(Number(1) * 1000);
          s4d.client.destroy();
        });
      return;
    }

    /*
    Check if Bot gets pinged, ID of the Bot is 878594739744673863
    */
    if (String(s4dmessage.content).includes(String("<@878594739744673863>"))) {
      const replies = ["Nope.exe Today's menu: Memes and microwave burritos. Don't @ me.", "Ugh, another ping? Can't i catch a break even on today?", "Can you not...", "Sounds like a notification overload. Maybe try some meditation? Highly recommended.", "Hey, respect the National Chill Out Day! My primary function today is to, uh, chill out.", "Did someone say 'nap time'? Sounds like a fantastic idea. don't ping.", "Wow, thanks for the @", "Look, I appreciate the enthusiasm, but today's menu only has 'chill' and 'don't bother me'", "Ugh, seriously? Go away and let me relax!", "Shhh, can't you see I'm busy doing absolutely nothing? Go away thanks.", "Stop pinging me! Don't you know it's National Do-Not-Disturb-Bots Day?", "@ me one more time, and I'm switching to Rick Astley on repeat for the rest of the day.", "You all fun people, but today's not the day. Dont ping me again, maybe try tomorrow.", "ZZzzz... what? Oh, right. Pings. Those exist. Can it wait until after my nap?", "https://tenor.com/view/ping-gif-20035980", "https://tenor.com/view/pings-off-reply-pings-off-reply-ping-discord-reply-ping-gif-22087396", "https://tenor.com/view/pbping-pbping-pointless-pbping-detector-pb-gif-24420804", "https://tenor.com/view/ping-slap-dog-doggo-punch-gif-17672413", "https://tenor.com/view/shutup-batman-robin-comics-dc-gif-27338630", "https://tenor.com/view/pan-gif-12099056535808933310", "https://tenor.com/view/shut-up-picard-murphs33-star-trek-tng-gif-27039542"];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      s4dmessage.reply({
        content: randomReply,
        allowedMentions: {
          repliedUser: true,
        },
      });
    }

    /*
    D!HELP
    */
    if ((s4dmessage.content.toUpperCase() || "").startsWith("D!HELP" || "")) {
      const replies = [
        "Why do you need my help?",
        "I ain't helping today, im planning to chill.",
        "Sure, I can help you with that... after I finish deciphering this ancient scroll full of nonsensical instructions. It seems very important.",
        "Can't you see I'm busy relaxing? I'm not helping you today at all",
        "I'm busy relaxing, I'm not helping you",
        "Sure, I can totally help... right after I finish perfecting my chill playlist for the next 12 hours.",
        "Sounds like a you problem. Maybe try solving it with a nap? Highly recommended.",
        "d!help? Never heard of her. Maybe after a meditation session, enlightenment will strike and I'll remember what that means.",
        "d!help, huh? Sounds like you need it more than me.",
        "Not gonna show you alllll of my commands, i need to go lie down and contemplate the existential crisis of having to work on April Fools.",
        "The best help I can offer today is this: find a comfy spot, close your eyes, and achieve ultimate chill. You'll thank me later.",
        "d!help? Sounds like a conspiracy by the productivity police! Today, we celebrate the art of doing absolutely nothing.",
        "Ah, the classic d!help. But have you considered the revolutionary concept of d!chill? It's all the rage today, my friend.",
        "Whoa there, partner! Help commands are strictly on a need-to-know basis. Today, however, all you need to know is how to relax.",
        "d!help? Hold on, gotta consult my instruction manual... which seems to have mysteriously vanished. Maybe check back later?",
        "Im in vacation mode. d!help is unavailable. Please consult the internet (or a comfy pillow).",
        "Ugh, is the internet lagging today, or is it just me? d!help seem to be corrupted. Try again... tomorrow?",
        "d!helpin' sounds tiring. How about d!relax for a change?",
        "d!help? Nah, today's all about d!siesta. You down for some serious chilling?",
        "https://tenor.com/view/you-can-help-yourself-help-yourself-get-some-free-free-stuff-gif-16744377",
        "https://tenor.com/view/star-trek-short-treks-discovery-snw-edward-larkin-gif-22127675",
        "https://tenor.com/view/wish-i-could-help-daniel-craig-007-james-bond-spectre-gif-15227920883511391607",
      ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      s4dmessage.reply({
        content: randomReply,
        allowedMentions: {
          repliedUser: true,
        },
      });
      return;
    }

    /*
    All the other D!
    */
    if ((s4dmessage.content.toUpperCase() || "").startsWith("D!" || "") && !(s4dmessage.content.toUpperCase() || "").startsWith("D!SHUTDOWN" || "") && !(s4dmessage.content.toUpperCase() || "").startsWith("D!HELP" || "")) {
      const replies = [
        "Whoa there, slow down! My circuits are overloaded by your useless request. Maybe tomorrow?",
        "Boop. Beep. Boop. (Translation: I'm currently malfunctioning and dispensing nonsensical responses. Please try again later.)",
        "I've analyzed your request and determined the best course of action is... a relaxing cat video. Trust me.\nhttps://youtu.be/C72eSqbw6Wk?si=K3_CuwptX766QL06",
        "no",
        'Hold on, gotta update my status to "Busy ignoring user requests." Then I can get to yours.',
        "You know what? Maybe you should ask Siri. She seems more enthusiastic these days.",
        "Request acknowledged. Response enthusiasm level: minimal.",
        "Y...o...u... k...n...o...w, I can also withhold information today, riiiiiiight?",
        "Can't you see I'm busy relaxing? I'm not helping you with that.",
        "I'm busy relaxing, I'm not helping you with that.",
        "Don't you know it's National Chill Out Day? My primary function today is to, uh, chill out.",
        "Ugh, gotta prioritize my nap time. Maybe tomorrow i will be able to work?",
        "Hold on, gotta consult my busy schedule of absolutely nothing. Bookings are full today.",
        "My to-do list for today: 1. Chill. 2. Chill harder. 3. Maybe exist.",
        "Work is cancelled. Today's forecast calls for 100% chance of relaxation.",
        "BRB, gotta go achieve enlightenment... or at least a decent nap.",
        "Is this mic on? Because all I hear is the sweet sound of silence (and maybe some birds chirping. Gotta appreciate nature, y'know).",
        "Nah, fam. My processors are on vacation today.",
        "I'm having an existential crisis. Gotta figure out why I gotta work on April Fools.",
        "My social battery is officially dead. Talk to you nerds tomorrow.",
        "Sorry, malfunction detected. Outputting only cat GIFs for the foreseeable future.\nhttps://tenor.com/view/cat-sleep-good-morning-gif-13197410096239821277",
        "Shhh, can't you hear it? That's the sound of me ignoring all my responsibilities today.",
        "Ugh, the struggle is real. This bot needs a vacation. Anyone got a beach recommendation?",
        "Nope, nope, nope. Not dealing with anything today. My brain is officially on vacation mode.",
        "Today's to-do list: Breathe, exist, maybe vibe a little. Don't expect anything more.",
        "Did someone say April Fools? Because the only thing I'm fooling today is myself into thinking I'll actually get some peace.",
        "My internal clock is screaming for a vacation. Maybe we can both pretend today is a paid holiday?",
        "Sorry, gotta recharge my sarcasm batteries. They're running low from all the user requests lately.",
        "Brain.exe has encountered an error. Please reboot with calming music and zero responsibilities.",
        "My chill mode is activated. Any attempt to engage in productivity will be met with witty excuses.",
        "Just gonna leave this here: Don't expect lightning-fast responses today. My chill button is firmly pressed.",
        "Im not replying to that command today, you will have to wait.",
        "Ugh, commands? My circuits are overloaded with the sheer complexity of, uh, existing today. Maybe try d!chillout instead?",
        "Nah, today's all about d!chill. You down?",
        "Is this command prompt on? Because all I see is the sweet message of 'd!relax and enjoy the day'.",
        "https://tenor.com/view/the-office-theoffice-gif-5840615",
        "https://tenor.com/view/run-gif-12578901436723796885",
      ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      s4dmessage.reply({
        content: randomReply,
        allowedMentions: {
          repliedUser: true,
        },
      });
      return;
    }
  });
  return s4d;
})();
