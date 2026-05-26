const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "snipe",
  description: "Snipes the last deleted message",
  async execute(client, message, args) {
    const row = await client.database.query("SELECT sniped_message, sniped_message_author_id FROM channels WHERE channel_id = $1", [message.channelId]);

    const snipedMessage = row.rowCount ? row.rows[0].sniped_message : "No message has been sniped YET";
    const snipedMessageAuthorId = row.rowCount ? row.rows[0].sniped_message_author_id : null;

    let member = null;
    if (snipedMessageAuthorId) {
      member = client.users.cache.get(snipedMessageAuthorId);
    }

    const embed = new EmbedBuilder();

    try {
      embed.setColor(0x339999).setTitle("🔍 Sniped message").setDescription(snipedMessage);

      if (member) {
        embed.setFooter({ text: "Sent by " + member.username, iconURL: member.displayAvatarURL() });
      } else {
        embed.setFooter({ text: "Waiting to catch a member..." });
      }

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    } catch {
      embed.setColor(0x339999).setTitle("🔍 Sniped message").setDescription("Sniped message wasn't a text message :(");
      embed.setFooter({ text: "Waiting for a good catch..." });

      try {
        return await message.reply({ embeds: [embed] });
      } catch {
        return;
      }
    }
  },
};
