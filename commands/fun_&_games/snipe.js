const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "snipe",
  description: "Snipes the last deleted message",
  async execute(client, message, args) {
    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT snipedMessage, snipedMessageAuthorId FROM Channel WHERE channelId = ?", message.channel.id, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const snipedMessage = row ? row.snipedMessage : "No message has been sniped YET";
    const snipedMessageAuthorId = row ? row.snipedMessageAuthorId : null;

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
        embed.setFooter({ text: "Waiting to catch..." });
      }

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    } catch (error) {
      embed.setColor(0x339999).setTitle("🔍 Sniped message").setDescription("Sniped message wasn't a text message :(");
      embed.setFooter({ text: "Waiting for a good catch..." });

      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }
  },
};
