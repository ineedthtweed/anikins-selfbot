const { PermissionsBitField } = require("discord.js");
const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "purge",
  description:
    "Deletes a specified number of messages from the user ID in config.json.",
  async execute(message, args) {
    if (message.author.id !== config.userId) return; // Do nothing if the user doesn't have permissiom
    // Check if a number is provided
    if (!args[0] || isNaN(args[0])) {
      return message.channel.send(
        "Please specify the number of messages to delete."
      );
    }

    const deleteCount = parseInt(args[0]); // Convert the argument to an integer
    if (deleteCount <= 0 || deleteCount > 100) {
      // Limit to a maximum of 100 messages
      return message.channel.send("Please enter a number between 1 and 100.");
    }

    // Get user ID from config.json
    const userId = config.userId;

    // Fetch messages from the current channel
    const messages = await message.channel.messages.fetch({ limit: 100 });

    // Filter messages to include only those from the specified user ID
    const filteredMessages = messages
      .filter((msg) => msg.author.id === userId)
      .first(deleteCount);

    // Attempt to delete messages
    try {
      let deletedMessages = 0;
      for (const msg of filteredMessages.values()) {
        await msg.delete();
        deletedMessages++;
      }

      message.channel
        .send(`\`\`\`ansi\n\x1b[32mSuccessfully purged ${deletedMessages} messages
\x1b[0m\n\`\`\``);
    } catch (error) {
      console.error("Error purging messages:", error);
      message.channel.send(
        `\`\`\`ansi\n\x1b[35mAn error occurred while purging messages:\n${error.message}\x1b[0m\n\`\`\``
      );
    }
  },
};
