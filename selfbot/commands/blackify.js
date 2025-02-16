const config = require("../config.json");
const blackifyTasks = {};
const blackifys = [
  "woah jamal dont pull out the nine",
  "cotton picker 🧑‍🌾",
  "back in my time...",
  "worthless nigger! 🥷",
  "chicken warrior 🍗",
  "its just some watermelon chill 🍉",
  "are you darkskined perchance?",
  "you... STINK 🤢",
];
const emojis = ["🍉", "🍗", "🤢", "🥷", "🔫"];
const reactionDelay = 1000; // Reaction delay in milliseconds

module.exports = {
  name: "blackify",
  description: "Starts blackify task for a user",
  async execute(message, args) {
    if (args.length === 0) {
      return message.channel.send("Please mention a user.");
    }

    // Check if any members were mentioned before attempting to get the first one
    if (!message.mentions.members.size) {
      return message.channel.send(
        "Invalid user mentioned. Please make sure you are mentioning a valid user."
      );
    }
    const user = message.mentions.members.first();

    if (!user) {
      return message.channel.send("Invalid user mentioned.");
    }

    // Start the blackify task for the user
    blackifyTasks[user.id] = true;
    await message.channel.send(
      `\`\`\`Seems to be that ${user.user.username}, IS BLACK 🤢\`\`\``
    );

    const blackifyTask = async () => {
      while (blackifyTasks[user.id]) {
        try {
          const messages = await message.channel.messages.fetch({ limit: 10 });
          const userMessages = messages.filter(
            (msg) => msg.author.id === user.id
          );

          for (const msg of userMessages.values()) {
            for (const emoji of emojis) {
              try {
                await msg.react(emoji);
              } catch (error) {
                console.error(`Failed to react to message ${msg.id}:`, error);
              }
            }

            try {
              const reply =
                blackifys[Math.floor(Math.random() * blackifys.length)];
              await msg.reply(reply);
            } catch (error) {
              console.error(`Failed to reply to message ${msg.id}:`, error);
            }

            break;
          }
          await new Promise((resolve) => setTimeout(resolve, reactionDelay));
        } catch (error) {
          console.error(`Error fetching messages for user ${user.id}:`, error);
        }
      }
    };

    // Run the blackify task every 1000 milliseconds (1 second) after the initial message
    setTimeout(blackifyTask, 1000);
  },
};
