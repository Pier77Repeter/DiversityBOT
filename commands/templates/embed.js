const { AttachmentBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "embed",
  description: "Test embed command",
  async execute(client, message, args) {
    // use this to upload images from media folder, it always starts from the root folder where 'index.js' is located
    const imageFile = new AttachmentBuilder("./media/DVC_highquality.png");

    // creating the embed using the 'EmbedBuilder()'
    const messageEmbed = new EmbedBuilder()
      .setColor(0x00ff00) // setting up the embed color in HEX, always put '0x' before the value
      .setTitle("Title V1")
      .setDescription("Using classic embed creation")
      .addField("Field 1", "Value 1")
      .addField("Field 2", "Value 2")
      .addField("Field 3", "Value 3", true) // the 'true' means the field will be inline, by default is 'false'
      .setTimestamp() // date and time when the embed was created
      .setFooter("Footer")
      .setThumbnail(message.author.displayAvatarURL()) // thumbnail of the embed is the message author's avatar, aka pfp
      .setImage("attachment://DVC_highquality.png"); // to upload local images, always put 'attachment://' before the file name

    // sending the embed with the image and return because it's the last thing to do
    try {
      // to put embeds and images inside message.reply() you do this '{ embeds: [embed1, embed2], files: [file1, file2] }'
      return await message.reply({ embeds: [messageEmbed], files: [imageFile] });
    } catch (error) {
      return;
    }
  },
};
