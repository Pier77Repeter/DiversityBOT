module.exports = {
  name: "jsondb",
  description: "Testing storing JSON in string",
  async execute(client, message, args) {
    // possible itemId format
    const jsonData = '{"itemId1": true, "itemId2": false, "itemId2Count": 10}';

    // this is the bare bone code to insert JSON shit
    await new Promise((resolve, reject) => {
      client.database.run("INSERT INTO Test VALUES (?, ?)", [4, jsonData], function (err) {
        if (err) {
          console.error("Error inserting JSON:", err);
          reject();
        } else {
          console.log("JSON inserted successfully.");
          resolve();
        }
      });
    });

    const data = await new Promise((resolve, reject) => {
      client.database.get("SELECT testString FROM Test WHERE id = 4", [], (err, row) => {
        if (err) {
          console.error("Error:", err);
          reject();
        } else if (row) {
          try {
            // converting the reply into JSON
            const parsedJson = JSON.parse(row.testString);
            console.log("JSON data from db:", parsedJson);
            resolve(parsedJson);
          } catch (err) {
            console.error("Error parsing JSON:", err);
            reject();
          }
        } else {
          console.log("No row found.");
        }
      });
    });

    try {
      return await message.reply("Bro you indeed have: " + data.itemId1 + " and you have: " + data.itemId2Count + " of item 2");
    } catch (error) {
      return;
    }
  },
};
