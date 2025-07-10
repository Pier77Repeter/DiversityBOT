module.exports = {
  name: "database",
  description: "Get database.db",
  async execute(client, message, args) {
    if (message.author.id !== "724990112030654484") return;

    // somehow i need to backup the database since i can't accesse the file
    try {
      return await message.reply({ files: ["database.db"] });
    } catch (error) {
      return;
    }
  },
};
