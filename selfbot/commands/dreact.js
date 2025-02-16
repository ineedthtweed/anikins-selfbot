const { Client } = require("discord.js-selfbot-v13");
const config = require("../config.json"); // Ensure you have your config file for user ID

const client = new Client();
const dreact_users = {}; // { user_id: [emojis_list, current_index] }

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const user_react_data = dreact_users[message.author.id];
  if (user_react_data) {
    const [emojis, index] = user_react_data;
    if (!emojis || emojis.length === 0) {
      //check if emojis is empty
      delete dreact_users[message.author.id]; // Clean up if no emojis
      return;
    }

    const emoji = emojis[index % emojis.length];

    try {
      await message.react(emoji);
      user_react_data[1] = index + 1; // Increment, handle modulo inside the emoji selection
    } catch (error) {
      console.error(`Failed to react with emoji: ${emoji}`, error);
    }
  }
});

module.exports = {
  dreact: {
    name: "dreact",
    description: "Starts alternating reactions on a user's messages",
    async execute(message, args) {
      const user = message.mentions.users.first();
      const emojis = args.slice(1);

      if (!user) {
        return message.channel.send("Please mention a user.");
      }

      if (!emojis.length) {
        return message.channel.send("Please provide at least one emoji.");
      }

      // Validate emojis (basic check)
      const validEmojis = emojis.filter((emoji) => {
        try {
          // Attempt to react to the emoji to check if it's valid
          message.react(emoji);
          return true; // If no error, it's likely valid
        } catch (err) {
          return false;
        }
      });
      if (validEmojis.length === 0) {
        return message.channel.send("None of the provided emojis are valid.");
      }

      dreact_users[user.id] = [validEmojis, 0];
      await message.channel.send(
        `Now alternating reactions with ${validEmojis.length} emojis on ${user.username}'s messages.`
      );
    },
  },
  dreactoff: {
    name: "dreactoff",
    description: "Stops alternating reactions on a user's messages",
    async execute(message, args) {
      const user = message.mentions.users.first();

      if (!user) {
        return message.channel.send("Please mention a user.");
      }

      if (dreact_users[user.id]) {
        delete dreact_users[user.id];
        await message.channel.send(
          `Stopped reacting to ${user.username}'s messages.`
        );
      } else {
        await message.channel.send(
          "This user doesn't have dynamic reactions enabled."
        );
      }
    },
  },
};

client.login(config.token1);
