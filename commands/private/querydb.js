const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "querydb",
  description: "Execute a SQL query against the database",
  async execute(client, message, args) {
    if (message.author.id !== "724990112030654484") return;

    const query = args.join(" ");

    if (!query) {
      try {
        return message.reply("Please provide a SQL query to execute.");
      } catch (error) {
        return;
      }
    }

    if (query.toLowerCase().startsWith("select")) {
      // Handle SELECT queries differently
      client.database.all(query, [], (err, rows) => {
        if (err) {
          console.error("SQL Error:", err);
          try {
            return message.reply(`Error executing query:\n\`\`\`sql\n${query}\`\`\`\n\`\`\`\n${err.message}\`\`\``);
          } catch (error) {
            return;
          }
        }

        if (!rows || rows.length === 0) {
          try {
            return message.reply("No results found.");
          } catch (error) {
            return;
          }
        }

        // Use Embeds for better formatting, especially for large results
        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("SQL Query Results")
          .setDescription(`\`\`\`sql\n${query}\`\`\``);

        // Format and add rows to the embed (handling potential embed limits)
        const maxFieldsPerEmbed = 25; // Discord embed field limit
        let currentEmbed = embed;
        let fieldCount = 0;

        for (const row of rows) {
          const rowString = Object.entries(row)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");

          if (fieldCount < maxFieldsPerEmbed) {
            currentEmbed.addFields({ name: `Row ${fieldCount + 1}`, value: `\`\`\`json\n${rowString}\`\`\`` });
            fieldCount++;
          } else {
            try {
              message.reply({ embeds: [currentEmbed] });
            } catch (error) {
              return;
            }

            currentEmbed = new EmbedBuilder()
              .setColor(0x0099ff)
              .addFields({ name: `Row ${fieldCount + 1}`, value: `\`\`\`json\n${rowString}\`\`\`` });
            fieldCount = 1;
          }
        }

        try {
          return message.reply({ embeds: [currentEmbed] });
        } catch (error) {
          return;
        }
      });
    } else {
      // Handle other queries (CREATE, INSERT, UPDATE, DELETE)
      client.database.run(query, function (err) {
        if (err) {
          console.error("SQL Error:", err);
          try {
            return message.reply(`Error executing query:\n\`\`\`sql\n${query}\`\`\`\n\`\`\`\n${err.message}\`\`\``);
          } catch (error) {
            return;
          }
        }

        let resultMessage = `Query executed successfully:\n\`\`\`sql\n${query}\`\`\``;

        if (this.changes) {
          resultMessage += `\n${this.changes} row(s) affected.`;
        }

        try {
          message.reply(resultMessage);
        } catch (error) {
          return;
        }
      });
    }
  },
};
