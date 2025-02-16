const config = require("/project/workspace/selfbot/config.json"); // Assuming config.json contains your user ID

const commandStopReply = {
  name: "stopareply",
  description: "Stop auto-reply for the current channel.",
  async execute(message, args, activeAutoReacts, client, targetUsers) {
    const channelId = message.channel.id;

    // Check if the message author has permission (e.g., is the owner)
    if (message.author.id !== config.userId) {
      return message.reply("You do not have permission to stop auto-reply."); // Inform the user
    }

    if (targetUsers && targetUsers[channelId]) {
      // Check if targetUsers and the channel exists
      delete targetUsers[channelId]; // Remove the target user for this channel
      console.log(`Auto-reply stopped for channel ${channelId}`);
      return message.reply(
        `\`\`\`ansi\n\x1b[31mAuto-reply has been canceled\x1b[0m\n\`\`\``
      );
    } else {
      return message.reply(
        `\`\`\`ansi\n\x1b[31mAuto-reply is not active.  Use .removetarget if it proceeds to auto-reply.\x1b[0m\n\`\`\``
      );
    }
  },
};

module.exports = commandStopReply;
