const config = require("../config.json");
const blackifyTasks = require("./blackify").blackifyTasks;

module.exports = {
  name: "unblackify",
  description: "Stops blackify task for a user",
  async execute(message, args) {
    if (args.length === 0) {
      return message.channel.send("Please mention a user.");
    }

    const user = message.mentions.members.first();
    if (!user) {
      return message.channel.send("Invalid user mentioned.");
    }

    if (blackifyTasks[user.id]) {
      blackifyTasks[user.id] = false;
      await message.channel.send(
        `\`\`\`Seems to me that ${user.user.username}, suddenly changed races 🧑‍🌾\`\`\``
      );
    } else {
      await message.channel.send("This user is not blackified.");
    }
  },
};
