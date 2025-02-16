const Discord = require("discord.js-selfbot-v13");
const config = require("../config.json"); // Import config

module.exports = {
  name: "typing",
  description: "Simulates typing in a channel for a specified duration.",
  async execute(message, args, activeAutoReacts, client) {
    execute(message, args);
    if (message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission
    }
    const time = args[0];
    let channel = message.mentions.channels.first(); // Check for channel mention first

    if (!channel) {
      // If no channel mention, try to get it from the ID provided.
      const channelId = args[1]; // Assuming the channel ID is the second argument
      if (channelId) {
        channel = client.channels.cache.get(channelId);
      }
    }

    if (!channel) {
      channel = message.channel; // Default to current channel
    }

    if (!channel || channel.type !== Discord.ChannelType.GuildText) {
      return message.reply(
        "Please provide a valid text channel (either mention it or provide its ID)."
      );
    }

    let totalSeconds = 0;

    try {
      if (time.endsWith("s")) {
        totalSeconds = parseInt(time.slice(0, -1));
      } else if (time.endsWith("m")) {
        totalSeconds = parseInt(time.slice(0, -1)) * 60;
      } else if (time.endsWith("h")) {
        totalSeconds = parseInt(time.slice(0, -1)) * 3600;
      } else {
        totalSeconds = parseInt(time);
      }

      if (isNaN(totalSeconds) || totalSeconds <= 0) {
        return message.reply(
          "Please provide a valid time format (e.g., 5s, 2m, 1h)."
        );
      }

      await message.reply(
        `Simulating typing in ${channel.toString()} for ${totalSeconds} seconds.`
      );
      let typingInterval = null;

      typingInterval = setInterval(() => {
        channel.sendTyping().catch(console.error);
      }, 10000);

      setTimeout(() => {
        clearInterval(typingInterval);
        console.log(`Typing simulation in ${channel.name} stopped.`);
      }, totalSeconds * 10000);
    } catch (error) {
      console.error("Error simulating typing:", error);
      return message.reply(`Error simulating typing: ${error.message}`);
    }
  },
};
