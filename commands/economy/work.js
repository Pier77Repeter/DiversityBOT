const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags, ButtonBuilder } = require("discord.js");
const cooldownManager = require("../../utils/cooldownManager");
const mathRandomInt = require("../../utils/mathRandomInt");
const manageUserMoney = require("../../utils/manageUserMoney");

module.exports = {
  name: "work",
  description: "Work to get money",
  cooldown: 3600,
  async execute(client, message, args) {
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT jobType FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const embed = new EmbedBuilder();

    if (!row || row.jobType == "null") {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You don't have a job right now, do **d!jobs** to get one");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const cooldown = await cooldownManager(client, message, "workCooldown", this.cooldown);
    if (cooldown == null) return;

    if (cooldown != 0) {
      embed.setColor(0x000000).setDescription("⏰ You've already worked, next turn **<t:" + cooldown[1] + ":R>**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    // AI is back again
    // Firefighter Buttons
    const fireFighterOneBtn = new ButtonBuilder().setCustomId("btn-work-fireFighter-one").setLabel("Save an animal").setStyle(ButtonStyle.Primary);

    const fireFighterTwoBtn = new ButtonBuilder().setCustomId("btn-work-fireFighter-two").setLabel("Extinguish fire").setStyle(ButtonStyle.Primary);

    const fireFighterThreeBtn = new ButtonBuilder().setCustomId("btn-work-fireFighter-three").setLabel("Rescue a person").setStyle(ButtonStyle.Primary);

    // Teacher Buttons
    const teacherOneBtn = new ButtonBuilder().setCustomId("btn-work-teacher-one").setLabel("Math").setStyle(ButtonStyle.Primary);

    const teacherTwoBtn = new ButtonBuilder().setCustomId("btn-work-teacher-two").setLabel("Literature").setStyle(ButtonStyle.Primary);

    const teacherThreeBtn = new ButtonBuilder().setCustomId("btn-work-teacher-three").setLabel("History").setStyle(ButtonStyle.Primary);

    // Discord Mod Buttons
    const discordModOneBtn = new ButtonBuilder().setCustomId("btn-work-discordMod-one").setLabel("Check the chat").setStyle(ButtonStyle.Primary);

    const discordModTwoBtn = new ButtonBuilder().setCustomId("btn-work-discordMod-two").setLabel("Moderate the vc").setStyle(ButtonStyle.Primary);

    const discordModThreeBtn = new ButtonBuilder().setCustomId("btn-work-discordMod-three").setLabel("Answer DMs").setStyle(ButtonStyle.Primary);

    // Mechanic Buttons
    const mechanicOneBtn = new ButtonBuilder().setCustomId("btn-work-mechanic-one").setLabel("Repair a vehicle").setStyle(ButtonStyle.Primary);

    const mechanicTwoBtn = new ButtonBuilder().setCustomId("btn-work-mechanic-two").setLabel("Do a control").setStyle(ButtonStyle.Primary);

    const mechanicThreeBtn = new ButtonBuilder().setCustomId("btn-work-mechanic-three").setLabel("Rescue a vehicle").setStyle(ButtonStyle.Primary);

    // Chef Buttons
    const chefOneBtn = new ButtonBuilder().setCustomId("btn-work-chef-one").setLabel("First dish").setStyle(ButtonStyle.Primary);

    const chefTwoBtn = new ButtonBuilder().setCustomId("btn-work-chef-two").setLabel("Second dish").setStyle(ButtonStyle.Primary);

    const chefThreeBtn = new ButtonBuilder().setCustomId("btn-work-chef-three").setLabel("Dessert").setStyle(ButtonStyle.Primary);

    // Scientist Buttons
    const scientistOneBtn = new ButtonBuilder().setCustomId("btn-work-scientist-one").setLabel("Study").setStyle(ButtonStyle.Primary);

    const scientistTwoBtn = new ButtonBuilder().setCustomId("btn-work-scientist-two").setLabel("Publish research").setStyle(ButtonStyle.Primary);

    const scientistThreeBtn = new ButtonBuilder().setCustomId("btn-work-scientist-three").setLabel("Experiment").setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder();

    // setting the apropiate embed content and buttons, depending wich job the user has
    switch (row.jobType) {
      case "fireFighter":
        actionRow.setComponents(fireFighterOneBtn, fireFighterTwoBtn, fireFighterThreeBtn);

        embed.setColor(0x999999).setTitle("‼️ EMERGENCY").setDescription("There are 3 emergencys, you have to choose one to work on");
        break;
      case "teacher":
        actionRow.setComponents(teacherOneBtn, teacherTwoBtn, teacherThreeBtn);

        embed.setColor(0x999999).setTitle("📚 Time to teach").setDescription("There are 3 classes, you have to choose one to work on");
        break;
      case "discordMod":
        actionRow.setComponents(discordModOneBtn, discordModTwoBtn, discordModThreeBtn);

        embed.setColor(0x999999).setTitle("👮 Never stop moderating Discord").setDescription("There are 3 tasks, you have to choose one to work on");
        break;
      case "mechanic":
        actionRow.setComponents(mechanicOneBtn, mechanicTwoBtn, mechanicThreeBtn);

        embed.setColor(0x999999).setTitle("🔧 Time to work").setDescription("There are 3 tasks, you have to choose one to work on");
        break;
      case "chef":
        actionRow.setComponents(chefOneBtn, chefTwoBtn, chefThreeBtn);

        embed.setColor(0x999999).setTitle("👨‍🍳 It's cooking time").setDescription("There are 3 dishes, you have to choose one to work on");
        break;
      case "scientist":
        actionRow.setComponents(scientistOneBtn, scientistTwoBtn, scientistThreeBtn);

        embed.setColor(0x999999).setTitle("🔬 Looks like science").setDescription("There are 3 tasks, you have to choose one to work on");
        break;
    }

    var sentMessage,
      hasClickedBtn = false;

    try {
      sentMessage = await message.reply({ embeds: [embed], components: [actionRow] });
    } catch (error) {
      return;
    }

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        try {
          return await btnInteraction.reply({ content: "You can't work for someone else", flags: MessageFlags.Ephemeral });
        } catch (error) {
          return;
        }
      }

      hasClickedBtn = true;

      // probability to get fired, put this here so i dont copy and paste it every time
      if (mathRandomInt(1, 7) == 1) {
        await new Promise((resolve, reject) => {
          client.database.run("UPDATE User SET jobType = 'null' WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        fireFighterOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
        fireFighterTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
        fireFighterThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

        teacherOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
        teacherTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
        teacherThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

        discordModOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
        discordModTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
        discordModThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

        mechanicOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
        mechanicTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
        mechanicThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

        chefOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
        chefTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
        chefThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

        scientistOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
        scientistTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
        scientistThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

        embed.setColor(0xff0000).setTitle("☹️ Oh no").setDescription("You got fired and you lost your job :(");

        try {
          return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
        } catch (error) {
          return;
        }
      }

      var money;

      switch (btnInteraction.customId) {
        case "btn-work-fireFighter-one":
          fireFighterOneBtn.setStyle(ButtonStyle.Success).setDisabled(true);
          fireFighterTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          fireFighterThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("You saved an animal")
            .setDescription("You saved the classic cat on the tree, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-fireFighter-two":
          fireFighterOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          fireFighterTwoBtn.setStyle(ButtonStyle.Success).setDisabled(true);
          fireFighterThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("That was epik")
            .setDescription("You killed the fire that was burning the whole house, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-fireFighter-three":
          fireFighterOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          fireFighterTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          fireFighterThreeBtn.setStyle(ButtonStyle.Success).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("What an hero")
            .setDescription("You saved some people from fire and you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-teacher-one":
          teacherOneBtn.setStyle(ButtonStyle.Success).setDisabled(true);
          teacherTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          teacherThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("Interesting lesson")
            .setDescription("Maths is a very important subject, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-teacher-two":
          teacherOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          teacherTwoBtn.setStyle(ButtonStyle.Success).setDisabled(true);
          teacherThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("Kinda boring lesson")
            .setDescription("Don't feel like literature is interesting as history, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-teacher-three":
          teacherOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          teacherTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          teacherThreeBtn.setStyle(ButtonStyle.Success).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("Now we talking")
            .setDescription("History is always interesting, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-discordMod-one":
          discordModOneBtn.setStyle(ButtonStyle.Success).setDisabled(true);
          discordModTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          discordModThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("Nice ban")
            .setDescription("You banned a free Nitro Scammer, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-discordMod-two":
          discordModOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          discordModTwoBtn.setStyle(ButtonStyle.Success).setDisabled(true);
          discordModThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("/mute")
            .setDescription("You muted a rude dude in a voice channel, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-discordMod-three":
          discordModOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          discordModTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          discordModThreeBtn.setStyle(ButtonStyle.Success).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("No thanks")
            .setDescription("You answered fake Egirl in DMS, saying you ain't interested, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-mechanic-one":
          mechanicOneBtn.setStyle(ButtonStyle.Success).setDisabled(true);
          mechanicTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          mechanicThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("You repaired a vehicle")
            .setDescription("The client was really happy about that and you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-mechanic-two":
          mechanicOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          mechanicTwoBtn.setStyle(ButtonStyle.Success).setDisabled(true);
          mechanicThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("You controlled a vehicle")
            .setDescription("You checked your client's vehicle and it seems fine, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-mechanic-three":
          mechanicOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          mechanicTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          mechanicThreeBtn.setStyle(ButtonStyle.Success).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("You took your truck")
            .setDescription("You brought a broken vehicle into your garage and fixed it, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-chef-one":
          chefOneBtn.setStyle(ButtonStyle.Success).setDisabled(true);
          chefTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          chefThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("You cooked a nice first dish")
            .setDescription("Delicious food, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-chef-two":
          chefOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          chefTwoBtn.setStyle(ButtonStyle.Success).setDisabled(true);
          chefThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("You cooked a nice second dish")
            .setDescription("Delicious food again, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-chef-three":
          chefOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          chefTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          chefThreeBtn.setStyle(ButtonStyle.Success).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("You cooked a delicious dessert")
            .setDescription("Hmmmm it tastes so good, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-scientist-one":
          scientistOneBtn.setStyle(ButtonStyle.Success).setDisabled(true);
          scientistTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          scientistThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("You kept researching")
            .setDescription("You kept researching in your experiments and you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-scientist-two":
          scientistOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          scientistTwoBtn.setStyle(ButtonStyle.Success).setDisabled(true);
          scientistThreeBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("You published your findings")
            .setDescription("What an amaizing discovery you made, for that you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-work-scientist-three":
          scientistOneBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          scientistTwoBtn.setStyle(ButtonStyle.Secondary).setDisabled(true);
          scientistThreeBtn.setStyle(ButtonStyle.Success).setDisabled(true);

          money = mathRandomInt(100, 200);
          if ((await manageUserMoney(client, message, "+", money)) == null) return;

          embed
            .setColor(0x33cc00)
            .setTitle("You kept experimenting")
            .setDescription("You kept trying if the studys were correct, you got **" + money + "$**");

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
      }
    });

    collector.on("end", async () => {
      if (!hasClickedBtn) {
        fireFighterOneBtn.setDisabled(true);
        fireFighterTwoBtn.setDisabled(true);
        fireFighterThreeBtn.setDisabled(true);

        teacherOneBtn.setDisabled(true);
        teacherTwoBtn.setDisabled(true);
        teacherThreeBtn.setDisabled(true);

        discordModOneBtn.setDisabled(true);
        discordModTwoBtn.setDisabled(true);
        discordModThreeBtn.setDisabled(true);

        mechanicOneBtn.setDisabled(true);
        mechanicTwoBtn.setDisabled(true);
        mechanicThreeBtn.setDisabled(true);

        chefOneBtn.setDisabled(true);
        chefTwoBtn.setDisabled(true);
        chefThreeBtn.setDisabled(true);

        scientistOneBtn.setDisabled(true);
        scientistTwoBtn.setDisabled(true);
        scientistThreeBtn.setDisabled(true);

        embed.setColor(0xff0000).setTitle("🕛 Timeout").setDescription("You didn't choose any task, you lost your turn");

        try {
          return await sentMessage.edit({ embeds: [embed], components: [actionRow] });
        } catch (error) {
          return;
        }
      }
    });
  },
};
