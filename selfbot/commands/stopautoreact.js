const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "stopautoreact",
  description: "Stop auto-reacting.",
  execute(message, args) {
    if (message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission
    }

    const mentionedUser = message.mentions.users.first();
    const targetUserId = mentionedUser ? mentionedUser.id : message.author.id;
    const contextId = message.guild ? message.guild.id : message.channel.id;

    // Check if auto-react is enabled for this context and user
    if (
      activeAutoReacts.has(contextId) &&
      activeAutoReacts.get(contextId).has(targetUserId)
    ) {
      const userEmojis = activeAutoReacts.get(contextId).get(targetUserId);
      activeAutoReacts.get(contextId).delete(targetUserId); // Remove the user's emojis

      // If that was the last user in this context, remove the context from activeAutoReacts
      if (activeAutoReacts.get(contextId).size === 0) {
        activeAutoReacts.delete(contextId);
      }

      message.client.off("messageCreate", autoReactHandler(activeAutoReacts));

      message.reply(
        `\`\`\`ansi\n\x1b[35mAutoreact is now disabled for ${
          mentionedUser ? mentionedUser.username : "you"
        } in this context.\x1b[0m\n\`\`\``
      );
    } else {
      message.reply(
        `\`\`\`ansi\n\x1b[35mAuto-react is not active for ${
          mentionedUser ? mentionedUser.username : "you"
        } in this context.\x1b[0m\n\`\`\``
      );
    }
  },
};
