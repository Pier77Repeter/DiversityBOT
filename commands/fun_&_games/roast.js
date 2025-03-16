const listsGetRandomItem = require("../../utils/listsGetRandomItem");

module.exports = {
  name: "roast",
  description: "Roast mentioned user",
  async execute(client, message, args) {
    try {
      if (message.mentions.members.first() == null)
        return await message.reply(message.author.username + ", mention the user to roast");
    } catch (error) {
      return;
    }

    try {
      return await message.channel.send({
        content:
          message.mentions.members.first().user.username +
          " " +
          listsGetRandomItem([
            "no",
            "i'm nice, why i should be rude",
            "no roast for you",
            "Light travels faster than sound which is why you seemed bright until you spoke.",
            "Somewhere out there, there's a tree working very hard to produce oxygen so that you can breathe. I think you should go and apologize to it.",
            "If I threw a stick, you'd leave, right?",
            "If ignorance is bliss, you must be the happiest person on the planet.",
            "Everyone's entitled to act stupid once in a while, but you really abuse the privilege.",
            "I'd slap you but I don't want to make your face look any better.",
            "If laughter is the best medicine, your face must be curing the world.",
            "Don't worry about me. Worry about your eyebrows.",
            "You are more disappointing than an unsalted pretzel.",
            "Your face makes onions cry.",
            "If you're going to act like a turd, go lay on the yard.",
            "You're like the end pieces of a loaf of bread. Everyone touches you, but nobody wants you.",
            "You see that door? I want you on the other side of it.",
            "Jesus might love you, but everyone else definitely thinks you're an idiot.",
            "Do your parents even realize they're living proof that two wrongs don't make a right?",
            "Too bad you can't Photoshop your ugly personality.",
            "You are so full of shit, the toilet's jealous.",
            "You're a grey sprinkle on a rainbow cupcake.",
            "I will ignore you so hard you will start doubting your existence.",
            "It's kind of hilarious watching you try to fit your entire vocabulary into one sentence.",
            "If I wanted to hear from an asshole, I'd fart.",
            "You are the sun in my life… now get 93 million miles away from me.",
            "If I wanted to kill myself, I would simply jump from your ego to your IQ.",
            "I don't hate you, but if you were drowning, I would give you a high five.",
            "You were so happy for the negativity of your Covid test, we didn't want to spoil the happiness by telling you it was IQ test.",
            "Honey, only thing bothering me is placed between your ears.",
            "You are like a software update. every time I see you, I immediately think “not now”.",
            "You are the reason why there are instructions on shampoo bottles.",
            "It's all about balance… you start talking, I stop listening.",
            "You can't imagine how much happiness you can bring… by leaving the room.",
            "Earth is full. Go home.",
            "Ola soy Dora. Can you help me find where we asked?",
            "Somewhere tree is producing oxygen for you. I'm sorry for it.",
            "Every time I think you can't get any dumber, you are proving me wrong.",
            "You're not simply a drama queen. You're the whole royal family.",
            "Taking a picture of you would put a virus on my phone.",
            "Remember, if anyone says you're beautiful, it's all lies.",
            "Too bad you can't count jumping to conclusions and running your mouth as exercise. ",
            "You should wear a condom on your head. If you're going to be a dick, you might as well dress like one.",
            "Whoever told you to be yourself gave you really bad advice.",
            "You sound reasonable… Time to up my medication.",
            "If you're offended by my opinion, you should hear the ones I keep to myself.",
            "Keep rolling your eyes. Maybe you'll find your brain back there.",
            "I am allergic to stupidity, so I break out in sarcasm.",
            "You're the reason I prefer animals to people. ",
            "I am not ignoring you. I am simply giving you time to reflect on what an idiot you are being.",
            "You don't like me, then fuck off. Problem solved.",
            "Your birth certificate is an apology letter from the condom manufacturer.",
            "Did I invite you to my barbecue? Then why are you all up in my grill?",
            "Your secrets are always safe with me. I never even listen when you tell me them.",
            "I'd give you a nasty look but you've already got one.",
            "Were you born this stupid or did you take lessons?",
            "You should really come with a warning label.",
            "I don't know what your problem is, but I'm guessing it's hard to pronounce.",
          ]),
      });
    } catch (error) {
      return;
    }
  },
};
