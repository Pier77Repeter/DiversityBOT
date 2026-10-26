const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler");

function trunkStr(str, maxLength) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
}

module.exports = {
  name: "querydb",
  description: "Execute a SQL query against the database",
  async execute(client, message, args) {
    if (message.author.id !== "724990112030654484") return;

    const query = args.join(" ");

    if (!query) {
      message.reply("Please provide a valid PostgreSQL query, thanks").catch(msgErrorHandler);
      return;
    }

    if (query.length > 2000) {
      message.reply("This query is too long (max 2000 chars), shorten it a little").catch(msgErrorHandler);
      return;
    }

    const embed = new EmbedBuilder();

    const res = await client.database.query(query).catch((error) => {
      embed.setColor("DarkRed").setTitle("SQL Query Failed").setDescription(`Error Stacktrace log\n\`\`\`${error}\`\`\``);

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    });

    if (query.toLowerCase().startsWith("select")) {
      let embedDescText = "";

      for (let i = 0; i < res.rowCount; i++) {
        embedDescText += JSON.stringify(res.rows[i], null, 2);
      }

      // fit in whitin Discord limit
      if (embedDescText.length > 2000) embedDescText = trunkStr(embedDescText);

      embed.setColor("Green").setTitle("SQL Query Executed!").setDescription(`\`\`\`json\n${embedDescText}\`\`\``);

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
    }
  },
};
