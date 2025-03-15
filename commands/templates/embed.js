const { AttachmentBuilder } = require("discord.js");

module.exports = {
  name: "embed",
  description: "Test embed command",
  async execute(client, message, args) {
    const imageFile = new AttachmentBuilder("./media/DVC_highquality.png"); // use this to upload images from media folder

    // creating the embed object
    const messageEmbed = {
      title: "Title",
      description: "Description",
      color: 0x00ff00,
      fields: [
        {
          name: "Field 1",
          value: "Value 1",
        },
        {
          name: "Field 2",
          value: "Value 2",
        },
        {
          name: "Field 3",
          value: "Value 3",
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: "Footer",
      },
      thumbnail: {
        url: message.author.displayAvatarURL(),
      },
      image: {
        url: "attachment://DVC_highquality.png", // always put 'attachment://' before the file name
      },
    };

    // Sending the embed with the file
    try {
      return await message.reply({ embeds: [messageEmbed], files: [imageFile] });
    } catch (error) {
      return;
    }
  },
};
