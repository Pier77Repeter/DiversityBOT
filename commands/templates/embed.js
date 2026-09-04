const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const path = require("path");
const msgErrorHandler = require("../../utils/msgErrorHandler");

module.exports = {
  name: "embed",
  description: "Test embed command",
  async execute(client, message, args) {
    // use this to upload images from media folder, it always starts from the root folder where 'index.js' is located (cwd() method)
    const imageFile = new AttachmentBuilder(path.join(process.cwd(), "media", "DVC_highquality.jpg"), { name: "DVC_highquality.jpg" });

    // creating the embed using the 'EmbedBuilder()'
    const embed = new EmbedBuilder()
      .setColor(0x00ff00) // setting up the embed color in HEX, always put '0x' before the value
      .setTitle("Title V1")
      .setDescription("Using classic embed creation")
      .addFields({ name: "Field 1 Name", value: "Field 1 Content" }, { name: "Field 2 Name", value: "Field 2 Content", inline: true })
      .setTimestamp() // date and time when the embed was created
      .setFooter({ text: "Footer" })
      .setThumbnail(message.author.displayAvatarURL()) // thumbnail of the embed is the message author's avatar, aka pfp
      .setImage("attachment://DVC_highquality.jpg"); // to upload local images, always put 'attachment://' before the file name

    // sending the embed with the image and return because it's the last thing to do
    try {
      // to put embeds and images inside message.reply() you do this '{ embeds: [embed1, embed2], files: [file1, file2] }'
      return await message.reply({ embeds: [embed], files: [imageFile] });
    } catch (error) {
      return msgErrorHandler(error); // only log errors that aren't related to the Discord API, check the structure of the error with console.log(error)
    }
  },
};
