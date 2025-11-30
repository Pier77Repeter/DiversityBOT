const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "setup",
  description: "Setup up the bot",
  async execute(client, message, args) {
    const embed = new EmbedBuilder();

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("You need the permission `Administrator` to use this command");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    if (!args[0]) {
      embed
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Specify one of the following names: **mod**, **music**, **event**, **community**, **leveling**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    var row;

    switch (args[0].toLowerCase()) {
      case "mod":
        await new Promise((resolve, reject) => {
          // using NOT is a big brain move: if modCmd is 1, NOT modCmd evaluates to 0, while if modCmd is 0, NOT modCmd evaluates to 1 (It's an SQL operator)
          client.database.run("UPDATE Server SET modCmd = NOT modCmd WHERE serverId = ?", message.guild.id, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        row = await new Promise((resolve, reject) => {
          client.database.get("SELECT modCmd FROM Server WHERE serverId = ?", message.guild.id, (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        if (!row) {
          embed
            .setColor(0xff0000)
            .setTitle("❌ Error")
            .setDescription("Failed to update server config, please **report this error with your server ID**")
            .addFields({ name: "Submit here", value: "https://discord.gg/KxadTdz" });

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        embed.setColor(0x33ff33).setTitle("✅ Configuration updated");

        if (row.modCmd) {
          embed.setDescription("🔨 Moderation commands are now **ACTIVE**");
        } else {
          embed.setDescription("🔨 Moderation commands are now **NOT ACTIVE**");
        }

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "music":
        await new Promise((resolve, reject) => {
          client.database.run("UPDATE Server SET musiCmd = NOT musiCmd WHERE serverId = ?", message.guild.id, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        row = await new Promise((resolve, reject) => {
          client.database.get("SELECT musiCmd FROM Server WHERE serverId = ?", message.guild.id, (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        if (!row) {
          embed
            .setColor(0xff0000)
            .setTitle("❌ Error")
            .setDescription("Failed to update server config, please **report this error with your server ID**")
            .addFields({ name: "Submit here", value: "https://discord.gg/KxadTdz" });

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        embed.setColor(0x33ff33).setTitle("✅ Configuration updated");

        if (row.musiCmd) {
          embed.setDescription("🎵 Music commands are now **ACTIVE**");
        } else {
          embed.setDescription("🎵 Music commands are now **NOT ACTIVE**");
        }

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "event":
        await new Promise((resolve, reject) => {
          client.database.run("UPDATE Server SET eventCmd = NOT eventCmd WHERE serverId = ?", message.guild.id, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        row = await new Promise((resolve, reject) => {
          client.database.get("SELECT eventCmd FROM Server WHERE serverId = ?", message.guild.id, (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        if (!row) {
          embed
            .setColor(0xff0000)
            .setTitle("❌ Error")
            .setDescription("Failed to update server config, please **report this error with your server ID**")
            .addFields({ name: "Submit here", value: "https://discord.gg/KxadTdz" });

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        embed.setColor(0x33ff33).setTitle("✅ Configuration updated");

        if (row.eventCmd) {
          embed.setDescription("🎉 Events commands are now **ACTIVE**");
        } else {
          embed.setDescription("🎉 Events commands are now **NOT ACTIVE**");
        }

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "community":
        await new Promise((resolve, reject) => {
          client.database.run("UPDATE Server SET communityCmd = NOT communityCmd WHERE serverId = ?", message.guild.id, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        row = await new Promise((resolve, reject) => {
          client.database.get("SELECT communityCmd FROM Server WHERE serverId = ?", message.guild.id, (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        if (!row) {
          embed
            .setColor(0xff0000)
            .setTitle("❌ Error")
            .setDescription("Failed to update server config, please **report this error with your server ID**")
            .addFields({ name: "Submit here", value: "https://discord.gg/KxadTdz" });

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        embed.setColor(0x33ff33).setTitle("✅ Configuration updated");

        if (row.communityCmd) {
          embed.setDescription("🌍 Community commands are now **ACTIVE**");
        } else {
          embed.setDescription("🌍 Community commands are now **NOT ACTIVE**");
        }

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      case "leveling":
        await new Promise((resolve, reject) => {
          client.database.run("UPDATE Server SET levelingCmd = NOT levelingCmd WHERE serverId = ?", message.guild.id, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        row = await new Promise((resolve, reject) => {
          client.database.get("SELECT levelingCmd FROM Server WHERE serverId = ?", message.guild.id, (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        if (!row) {
          embed
            .setColor(0xff0000)
            .setTitle("❌ Error")
            .setDescription("Failed to update server config, please **report this error with your server ID**")
            .addFields({ name: "Submit here", value: "https://discord.gg/KxadTdz" });

          try {
            return await message.reply({ embeds: [embed] });
          } catch (error) {
            return;
          }
        }

        embed.setColor(0x33ff33).setTitle("✅ Configuration updated");

        if (row.levelingCmd) {
          embed.setDescription("🏆 Leveling commands are now **ACTIVE**");
        } else {
          embed.setDescription("🏆 Leveling commands are now **NOT ACTIVE**");
        }

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }

      default:
        embed
          .setColor(0xff0000)
          .setTitle("❌ Error")
          .setDescription("That config dosen't exist, choose between: **mod**, **music**, **event**, **community**, **leveling**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch (error) {
          return;
        }
    }
  },
};
