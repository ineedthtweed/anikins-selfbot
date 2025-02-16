const config = require("../config.json"); // Ensure you have your config file for user ID

// This should be outside of the execute function so we can refer to it in stop
const autoReactHandler = (activeAutoReacts) => {
  return async (msg) => {
    const contextId = msg.guild ? msg.guild.id : msg.channel.id;

    if (activeAutoReacts.has(contextId)) {
      const userIds = Array.from(activeAutoReacts.get(contextId).keys());
      for (const userId of userIds) {
        if (msg.author.id === userId) {
          const userEmojis = activeAutoReacts.get(contextId).get(userId);
          for (const emoji of userEmojis) {
            try {
              await msg.react(emoji);
            } catch (err) {
              console.error(`Failed to react with emoji ${emoji}:`, err);
            }
          }
        }
      }
    }
  };
};

module.exports = {
  name: "autoreact",
  description:
    "Automatically reacts to messages from specified users (including yourself) with specified emojis.",
  async execute(message, args, activeAutoReacts) {
    // Check if the user is authorized to execute this command
    if (message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission
    }

    const mentionedUser = message.mentions.users.first();
    const emojis = args.filter((arg) => !arg.startsWith("<@"));

    // Ensure both user and emoji are specified
    if (!mentionedUser && !emojis.length) {
      return message.reply(
        `\`\`\`ansi\n\x1b[35m mention a user and emoji to autoreact with.\x1b[0m\n\`\`\``
      );
    }

    const targetUserId = mentionedUser ? mentionedUser.id : message.author.id;
    const contextId = message.guild ? message.guild.id : message.channel.id;

    // Initialize the auto-react if it doesn't exist
    if (!activeAutoReacts.has(contextId)) {
      activeAutoReacts.set(contextId, new Map());
    }

    const contextAutoReacts = activeAutoReacts.get(contextId);

    // Initialize user emoji set if it doesn't exist
    if (!contextAutoReacts.has(targetUserId)) {
      contextAutoReacts.set(targetUserId, new Set());
    }

    const userEmojis = contextAutoReacts.get(targetUserId);
    emojis.forEach((emoji) => userEmojis.add(emoji));

    message.reply(
      `\`\`\`ansi\n\x1b[37mAutoreacting to ${
        mentionedUser ? mentionedUser.username : "you"
      } with ${Array.from(userEmojis).join(", ")}\x1b[0m\n\`\`\``
    );

    // Check if the event listener is already added
    if (!message.client.autoReactListenerAdded) {
      message.client.on("messageCreate", autoReactHandler(activeAutoReacts));
      message.client.autoReactListenerAdded = true; // Set a flag to avoid adding the listener multiple times
    }
  },
};
