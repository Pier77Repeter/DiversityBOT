module.exports = {
  name: "database",
  description: "Get database.db",
  async execute(client, message, args) {
    if (message.author.id !== "724990112030654484") return;

    try {
      return await message.reply({ files: ["database.db"] });
    } catch (error) {
      return;
    }
  },
};
