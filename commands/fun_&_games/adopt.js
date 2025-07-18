const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "adopt",
  description: "Adopt a new pet, the mentioned user...",
  async execute(client, message, args) {
    try {
      if (message.mentions.members.first() == null) return await message.reply(message.author.username + ", mention the user you want to adopt");
    } catch (error) {
      return;
    }

    const adoptedMember = message.mentions.members.first().user;

    const row = await new Promise((resolve, reject) => {
      client.database.get("SELECT hasPet FROM User WHERE serverId = ? AND userId = ?", [message.guild.id, message.author.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const embed = new EmbedBuilder().setColor(0xff0000).setTitle("❌ Error").setDescription("You already have a pet, type **d!pet** to check it!");

    if (row.hasPet) {
      try {
        return await message.reply({ embeds: [embed] });
      } catch (error) {
        return;
      }
    }

    const petStatsCooldown = Date.now() + 10800000; // start imediatly at 3h
    await new Promise((resolve, reject) => {
      client.database.run(
        "UPDATE User SET hasPet = 1, petId = ?, petStatsHealth = 100, petStatsFun = 100, petStatsHunger = 100, petStatsThirst = 100, petCooldown = ? WHERE serverId = ? AND userId = ?",
        [adoptedMember.id, petStatsCooldown, message.guild.id, message.author.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    embed
      .setColor(0x33cc00)
      .setTitle("You sucessfully adopted " + adoptedMember.username)
      .setDescription("You have now a pet, type **d!pet** to check his stats!")
      .setThumbnail(adoptedMember.displayAvatarURL())
      .setFooter({ text: "It is important to check his stats often" });

    try {
      return await message.reply({ embeds: [embed] });
    } catch (error) {
      return;
    }
  },
};
