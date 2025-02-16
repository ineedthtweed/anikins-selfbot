const { ActivityType } = require("discord.js");
const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "setrpc",
  description: "Sets your custom status (rich presence).",
  async execute(message, args) {
    if (message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission
    }

    if (args.length === 0) {
      return message.channel.send(
        `\`\`\`ansi\n\x1b[35mProvide a status message. Usage: !setrpc <message>\x1b[0m\n\`\`\``
      );
    }

    const statusMessage = args.join(" ");

    try {
      await message.client.user.setPresence({
        activities: [
          {
            name: statusMessage,
            type: ActivityType.Streaming,
            url: "https://twitch.tv/danikin",
          },
        ],
        status: "online", // or 'idle', 'dnd', 'invisible'
      });
      message.channel.send(
        `\`\`\`ansi\n\x1b[35mStatus set to: ${statusMessage}\x1b[0m\n\`\`\``
      );
    } catch (error) {
      console.error("Error setting status:", error); // Log error details
      message.channel.send(
        `\`\`\`ansi\n\x1b[35mFailed to set status: ${error.message}\x1b[0m\n\`\`\``
      ); // Provide error message
    }
  },
};
