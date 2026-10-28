const { EmbedBuilder } = require("discord.js");
const msgErrorHandler = require("../../utils/msgErrorHandler");

function truncateString(str, maxLength) {
  if (str.length <= maxLength) return str;

  return `${str.slice(0, maxLength - 3)}...`;
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

    const embed = new EmbedBuilder();

    let res;

    try {
      res = await client.database.query(query);
    } catch (error) {
      embed.setColor("Red").setTitle("SQL Query Failed").setDescription(`\`\`\`${error}\`\`\``);

      message.reply({ embeds: [embed] }).catch(msgErrorHandler);
      return;
    }

    const hasRows = res.rows.length > 0;
    const isSelect = res.command === "SELECT";

    let output = isSelect ? JSON.stringify(res.rows, null, 2) : `${res.command}: ${res.rowCount ?? 0} row(s) affected${hasRows ? `\n${JSON.stringify(res.rows, null, 2)}` : ""}`;

    if (output.length > 4000) {
      output = truncateString(output, 4000);

      embed.setFooter({ text: "Output truncated to fit Discord's limits" });
    }

    const outputFormat = isSelect || hasRows ? "json" : "txt";

    embed.setColor("Green").setTitle("SQL Query Executed!").setDescription(`\`\`\`${outputFormat}\n${output}\`\`\``);

    message.reply({ embeds: [embed] }).catch(msgErrorHandler);
  },
};
