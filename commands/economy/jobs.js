const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageFlags } = require("discord.js");

module.exports = {
  name: "jobs",
  description: "View jobs list",
  async execute(client, message, args) {
    const row = await new Promise((resolve, reject) => {
      client.database.get(
        "SELECT jobType FROM User WHERE serverId = ? AND userId = ?",
        [message.guild.id, message.author.id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("You already have a job, come back when you will eventually get fired");

    // null is a string in db
    if (row.jobType != "null") {
      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    embed
      .setColor(0x33ccff)
      .setTitle("🧑‍💼 List of jobs")
      .setDescription("You don't have a job at the moment, you need to choose one to use **d!work**")
      .setFooter({ text: "Click the buttons to choose a job" });

    const btnNext = new ButtonBuilder()
      .setCustomId("btn-jobs-btnNext")
      .setEmoji("➡️")
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary);
    const btnPrevious = new ButtonBuilder()
      .setCustomId("btn-jobs-btnPrevious")
      .setEmoji("⬅️")
      .setLabel("Previous")
      .setStyle(ButtonStyle.Primary);
    const btnFireFighter = new ButtonBuilder()
      .setCustomId("btn-jobs-btnFireFighter")
      .setEmoji("🚒")
      .setLabel("Fire Fighter")
      .setStyle(ButtonStyle.Primary);
    const btnTeacher = new ButtonBuilder()
      .setCustomId("btn-jobs-btnTeacher")
      .setEmoji("👩‍🏫")
      .setLabel("Teacher")
      .setStyle(ButtonStyle.Primary);
    const btnDiscordMod = new ButtonBuilder()
      .setCustomId("btn-jobs-btnDiscordMod")
      .setEmoji("💻")
      .setLabel("Discord Mod")
      .setStyle(ButtonStyle.Primary);
    const btnMechanic = new ButtonBuilder()
      .setCustomId("btn-jobs-btnMechanic")
      .setEmoji("🔧")
      .setLabel("Mechanic")
      .setStyle(ButtonStyle.Primary);
    const btnChef = new ButtonBuilder()
      .setCustomId("btn-jobs-btnChef")
      .setEmoji("🧑‍🍳")
      .setLabel("Chef")
      .setStyle(ButtonStyle.Primary);
    const btnScientist = new ButtonBuilder()
      .setCustomId("btn-jobs-btnScientist")
      .setEmoji("🧪")
      .setLabel("Scientist")
      .setStyle(ButtonStyle.Primary);

    // hmmmm, maybe this is better
    const actionRow = new ActionRowBuilder().setComponents(btnNext, btnFireFighter, btnTeacher, btnDiscordMod);

    var sentMessage;

    try {
      sentMessage = await message.reply({ embeds: [embed], components: [actionRow] });
    } catch (error) {
      return;
    }

    // better name it collector
    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    collector.on("collect", async (btnInteraction) => {
      if (btnInteraction.user.id !== message.author.id) {
        return await btnInteraction.reply({
          content: "Are you trying to steal someone else's job?!",
          flags: MessageFlags.Ephemeral,
        });
      }

      collector.resetTimer();

      switch (btnInteraction.customId) {
        case "btn-jobs-btnNext":
          actionRow.setComponents(btnPrevious, btnMechanic, btnChef, btnScientist);

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
        case "btn-jobs-btnPrevious":
          actionRow.setComponents(btnNext, btnFireFighter, btnTeacher, btnDiscordMod);

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
        case "btn-jobs-btnFireFighter":
          embed
            .setColor(0x33cc00)
            .setTitle("🚒 Fire Fighter")
            .setDescription("You are now a Fire Fighter, you can start working with **d!work**");

          btnNext.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnPrevious.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnFireFighter.setStyle(ButtonStyle.Success).setDisabled(true);
          btnTeacher.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDiscordMod.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnMechanic.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnChef.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnScientist.setStyle(ButtonStyle.Secondary).setDisabled(true);

          await new Promise((resolve, reject) => {
            client.database.run(
              "UPDATE User SET jobType = 'fireFighter' WHERE serverId = ? AND userId = ?",
              [message.guild.id, message.author.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }

        case "btn-jobs-btnTeacher":
          embed
            .setColor(0x33cc00)
            .setTitle("👩‍🏫 Teacher")
            .setDescription("You are now a Teacher, you can start working with **d!work**");

          btnNext.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnPrevious.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnFireFighter.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnTeacher.setStyle(ButtonStyle.Success).setDisabled(true);
          btnDiscordMod.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnMechanic.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnChef.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnScientist.setStyle(ButtonStyle.Secondary).setDisabled(true);

          await new Promise((resolve, reject) => {
            client.database.run(
              "UPDATE User SET jobType = 'teacher' WHERE serverId = ? AND userId = ?",
              [message.guild.id, message.author.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
        case "btn-jobs-btnDiscordMod":
          embed
            .setColor(0x33cc00)
            .setTitle("💻 Discord Mod")
            .setDescription("You are now a Discord Mod, you can start working with **d!work**");

          btnNext.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnPrevious.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnFireFighter.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnTeacher.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDiscordMod.setStyle(ButtonStyle.Success).setDisabled(true);
          btnMechanic.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnChef.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnScientist.setStyle(ButtonStyle.Secondary).setDisabled(true);

          await new Promise((resolve, reject) => {
            client.database.run(
              "UPDATE User SET jobType = 'discordMod' WHERE serverId = ? AND userId = ?",
              [message.guild.id, message.author.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
        case "btn-jobs-btnMechanic":
          embed
            .setColor(0x33cc00)
            .setTitle("🔧 Mechanic")
            .setDescription("You are now a Mechanic, you can start working with **d!work**");

          btnNext.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnPrevious.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnFireFighter.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnTeacher.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDiscordMod.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnMechanic.setStyle(ButtonStyle.Success).setDisabled(true);
          btnChef.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnScientist.setStyle(ButtonStyle.Secondary).setDisabled(true);

          await new Promise((resolve, reject) => {
            client.database.run(
              "UPDATE User SET jobType = 'mechanic' WHERE serverId = ? AND userId = ?",
              [message.guild.id, message.author.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
        case "btn-jobs-btnChef":
          embed
            .setColor(0x33cc00)
            .setTitle("🧑‍🍳 Chief")
            .setDescription("You are now a Chief, you can start working with **d!work**");

          btnNext.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnPrevious.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnFireFighter.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnTeacher.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDiscordMod.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnMechanic.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnChef.setStyle(ButtonStyle.Success).setDisabled(true);
          btnScientist.setStyle(ButtonStyle.Secondary).setDisabled(true);

          await new Promise((resolve, reject) => {
            client.database.run(
              "UPDATE User SET jobType = 'chief' WHERE serverId = ? AND userId = ?",
              [message.guild.id, message.author.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
        case "btn-jobs-btnScientist":
          embed
            .setColor(0x33cc00)
            .setTitle("🧪 Scientist")
            .setDescription("You are now a Scientist, you can start working with **d!work**");

          btnNext.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnPrevious.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnFireFighter.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnTeacher.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnDiscordMod.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnMechanic.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnChef.setStyle(ButtonStyle.Secondary).setDisabled(true);
          btnScientist.setStyle(ButtonStyle.Success).setDisabled(true);

          await new Promise((resolve, reject) => {
            client.database.run(
              "UPDATE User SET jobType = 'scientist' WHERE serverId = ? AND userId = ?",
              [message.guild.id, message.author.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          try {
            return await btnInteraction.update({ embeds: [embed], components: [actionRow] });
          } catch (error) {
            return;
          }
      }
    });

    collector.on("end", async () => {
      btnNext.setDisabled(true);
      btnPrevious.setDisabled(true);
      btnFireFighter.setDisabled(true);
      btnTeacher.setDisabled(true);
      btnDiscordMod.setDisabled(true);
      btnMechanic.setDisabled(true);
      btnChef.setDisabled(true);
      btnScientist.setDisabled(true);

      try {
        return await sentMessage.edit({ embeds: [embed], components: [actionRow] });
      } catch (error) {
        return;
      }
    });
  },
};
