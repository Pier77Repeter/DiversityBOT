const { EmbedBuilder } = require("discord.js");
/*
THIS COMMAND IS VIBE CODED, WILL BE RE-WRITTEN BEFORE 2.1 UPDATE
*/
module.exports = {
  name: "querydb",
  description: "Execute a SQL query against the database",
  async execute(client, message, args) {
    if (message.author.id !== "724990112030654484") return;

    const query = args.join(" ");

    if (!query) {
      try {
        return await message.reply("Please provide a SQL query to execute.");
      } catch {
        return;
      }
    }

    // 2. Execute unified PostgreSQL query string
    const result = await client.database.query(query);

    // 3. Process SELECT / Returning operations
    if (query.toLowerCase().trim().startsWith("select") || result.rows.length > 0) {
      if (result.rows.length === 0) {
        try {
          return await message.reply("No results found.");
        } catch {
          return;
        }
      }

      // Use Embeds for formatting row results
      const embed = new EmbedBuilder().setColor(0x0099ff).setTitle("SQL Query Results").setDescription(`\`\`\`sql\n${query}\`\`\``);

      const maxFieldsPerEmbed = 25; // Discord native embed structure threshold limit
      let currentEmbed = embed;
      let fieldCount = 0;

      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows[i];

        // Formats data beautifully into JSON output block representations
        const rowString = JSON.stringify(row, null, 2);

        if (fieldCount < maxFieldsPerEmbed) {
          currentEmbed.addFields({ name: `Row ${i + 1}`, value: `\`\`\`json\n${rowString}\`\`\`` });
          fieldCount++;
        } else {
          try {
            await message.reply({ embeds: [currentEmbed] });
          } catch {
            return;
          }

          currentEmbed = new EmbedBuilder().setColor(0x0099ff).addFields({ name: `Row ${i + 1}`, value: `\`\`\`json\n${rowString}\`\`\`` });
          fieldCount = 1;
        }
      }

      try {
        return await message.reply({ embeds: [currentEmbed] });
      } catch {
        return;
      }
    } else {
      // 4. Process Mutating commands (CREATE, INSERT, UPDATE, DELETE)
      // PostgreSQL stores affected count inside 'rowCount' rather than SQLite's 'this.changes'
      let resultMessage = `Query executed successfully:\n\`\`\`sql\n${query}\`\`\``;

      if (result.rowCount !== null && result.rowCount !== undefined) {
        resultMessage += `\n**${result.rowCount}** row(s) affected.`;
      } else if (result.command) {
        resultMessage += `\nCommand **${result.command}** completed successfully.`;
      }

      try {
        return await message.reply(resultMessage);
      } catch {
        return;
      }
    }

    try {
      return await message.reply(`❌ **Error executing query:**\n` + `\`\`\`sql\n${query}\`\`\`\n` + `\`\`\`text\n${error.message || error}\`\`\``);
    } catch {
      return;
    }
  },
};
