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
      } catch {
        return;
      }
    }

    if (!args[0]) {
      embed.setColor(0xff0000).setTitle("❌ Error").setDescription("Specify one of the following names: **mod**, **music**, **event**, **community**, **leveling**");

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }

    let row;

    switch (args[0].toLowerCase()) {
      case "mod":
        // returns the value of the config in db, either true or false
        if (await updateConfig("mod_cmd")) {
          embed.setDescription("🔨 Moderation commands are now **ACTIVE**");
        } else {
          embed.setDescription("🔨 Moderation commands are now **NOT ACTIVE**");
        }

        try {
          return await message.reply({ embeds: [embed] });
        } catch {
          return;
        }
        break;

      case "music":
        if (await updateConfig("music_cmd")) {
          embed.setDescription("🎵 Music commands are now **ACTIVE**");
        } else {
          embed.setDescription("🎵 Music commands are now **NOT ACTIVE**");
        }

        try {
          return await message.reply({ embeds: [embed] });
        } catch {
          return;
        }

      case "event":
        if (await updateConfig("event_cmd")) {
          embed.setDescription("🎉 Events commands are now **ACTIVE**");
        } else {
          embed.setDescription("🎉 Events commands are now **NOT ACTIVE**");
        }

        try {
          return await message.reply({ embeds: [embed] });
        } catch {
          return;
        }

      case "community":
        if (await updateConfig("community_cmd")) {
          embed.setDescription("🌍 Community commands are now **ACTIVE**");
        } else {
          embed.setDescription("🌍 Community commands are now **NOT ACTIVE**");
        }

        try {
          return await message.reply({ embeds: [embed] });
        } catch {
          return;
        }

      case "leveling":
        if (await updateConfig("leveling_cmd")) {
          embed.setDescription("🏆 Leveling commands are now **ACTIVE**");
        } else {
          embed.setDescription("🏆 Leveling commands are now **NOT ACTIVE**");
        }

        try {
          return await message.reply({ embeds: [embed] });
        } catch {
          return;
        }

      default:
        embed.setColor(0xff0000).setTitle("❌ Error").setDescription("That config dosen't exist, choose between: **mod**, **music**, **event**, **community**, **leveling**");

        try {
          return await message.reply({ embeds: [embed] });
        } catch {
          return;
        }
        break;
    }

    // bro, honestly it was time we write a function for this crap
    async function updateConfig(configName) {
      // using NOT is a big brain move: if modCmd is 1, NOT modCmd evaluates to 0, while if modCmd is 0, NOT modCmd evaluates to 1 (It's an SQL operator)
      await client.database.query(`UPDATE servers SET ${configName} = NOT ${configName} WHERE server_id = $1`, [message.guildId]);

      row = await client.database.query(`SELECT ${configName} FROM servers WHERE server_id = $1`, [message.guildId]);

      if (row.rowCount === 0) {
        embed
          .setColor(0xff0000)
          .setTitle("⚠️ Critical error")
          .setDescription("Failed to update server configs, please **report this error with the server ID**")
          .addFields({ name: "Server ID", value: `\`${message.guildId}\``, inline: true }, { name: "Submit Report Here", value: "https://discord.gg/KxadTdz" });

        try {
          return await message.reply({ embeds: [embed] });
        } catch {
          return;
        }
      }

      embed.setColor(0x33ff33).setTitle("✅ Configuration updated");

      return row.rows[0][configName];
    }
  },
};
