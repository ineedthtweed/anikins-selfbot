const { ActivityType } = require("discord.js");
const config = require("../config.json"); // Ensure you have your config file for user ID

let statusMessages = []; // Array to store the status messages
let currentStatusIndex = 0; // Index to track the current status message
let statusInterval; // Variable to store the interval for status rotation

module.exports = {
  name: "rstatus",
  description: "Rotates through a list of status messages.",
  execute(message, args) {
    if (message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission
    }

    if (args.length === 0) {
      // If no arguments are provided, list the current status messages
      if (statusMessages.length === 0) {
        const sentMessage = message.channel.send(
          "```ansi\n\x1b[35mNo status messages have been added yet. Use rstatus add <message> to add messages.\x1b[0m\n```"
        );
        deleteMessage(sentMessage);
        return;
      } else {
        let messageToSend =
          "```ansi\n\x1b[35mCurrent status messages:\x1b[0m\n";
        for (let index = 0; index < statusMessages.length; index++) {
          messageToSend += `\x1b[35m${index + 1}>\x1b[0m ${
            statusMessages[index]
          }\n`;
        }
        messageToSend += "```";
        const sentMessage = message.channel.send(messageToSend);
        deleteMessage(sentMessage);
        return;
      }
    }

    // Add messages to array
    if (args[0] === "add") {
      const newMessage = args.slice(1).join(" "); // Get all arguments after 'add' and join them
      if (newMessage.length > 0) {
        statusMessages.push(newMessage);
        const sentMessage = message.channel.send(
          `\`\`\`ansi\n\x1b[35mAdded "${newMessage}" to status messages.\x1b[0m\n\`\`\``
        );
        deleteMessage(sentMessage);
        return;
      } else {
        const sentMessage = message.channel.send(
          `\`\`\`ansi\n\x1b[35mPlease provide at least one message.\x1b[0m\n\`\`\``
        );
        deleteMessage(sentMessage);
        return;
      }
    }

    // Remove messages
    if (args[0] === "remove") {
      const removeMessage = args.slice(1).join(" "); // Get all arguments after 'remove' and join them
      const index = parseInt(removeMessage) - 1;
      if (!Number.isNaN(index) && index >= 0 && index < statusMessages.length) {
        statusMessages.splice(index, 1);
        const sentMessage = message.channel.send(
          `\`\`\`ansi\n\x1b[35mRemoved status number ${
            index + 1
          }\x1b[0m\n\`\`\``
        );
        deleteMessage(sentMessage);
        return;
      } else {
        const sentMessage = message.channel.send(
          `\`\`\`ansi\n\x1b[35mPlease provide a valid status number to remove.\x1b[0m\n\`\`\``
        );
        deleteMessage(sentMessage);
        return;
      }
    }

    // Start or stop the rotation
    if (args[0] === "start") {
      if (statusMessages.length === 0) {
        const sentMessage = message.channel.send(
          `\`\`\`ansi\n\x1b[35mPlease add some messages to rotate using rstatus add <message>\x1b[0m\n\`\`\``
        );
        deleteMessage(sentMessage);
        return;
      }
      if (statusInterval) {
        const sentMessage = message.channel.send(
          `\`\`\`ansi\n\x1b[35mStatus rotation is already running. Use rstatus stop to stop it.\x1b[0m\n\`\`\``
        );
        deleteMessage(sentMessage);
        return;
      }

      // Rotate status messages every 6 seconds
      statusInterval = setInterval(async () => {
        currentStatusIndex = (currentStatusIndex + 1) % statusMessages.length;
        const nextStatus = statusMessages[currentStatusIndex];
        const activityType = args[1] ? args[1].toLowerCase() : "playing"; // Default to 'playing' if not specified

        let activity;
        switch (activityType) {
          case "streaming":
            activity = ActivityType.Streaming;
            break;
          case "listening":
            activity = ActivityType.Listening;
            break;
          case "watching":
            activity = ActivityType.Watching;
            break;
          case "playing":
          default:
            activity = ActivityType.Playing; // Default if invalid type provided
        }

        try {
          if (activity === ActivityType.Streaming) {
            await message.client.user.setPresence({
              activities: [
                {
                  name: nextStatus,
                  type: activity,
                  url: "https://twitch.tv/deanikin",
                },
              ],
              status: "online",
            });
          } else {
            await message.client.user.setPresence({
              activities: [{ name: nextStatus, type: activity }],
              status: "online",
            });
          }
          console.log(`Status set to: ${nextStatus}`);
        } catch (error) {
          console.error("Error rotating status:", error);
        }
      }, 6000); // 6000 ms = 6 seconds

      const sentMessage = message.channel.send(
        `\`\`\`ansi\n\x1b[35mStatus rotation started! Use "rstatus stop" to stop it.\x1b[0m\n\`\`\``
      );
      deleteMessage(sentMessage);
      return;
    } else if (args[0] === "stop") {
      // Stop the rotation
      if (!statusInterval) {
        const sentMessage = message.channel.send(
          `\`\`\`ansi\n\x1b[35mStatus rotation is not running.\x1b[0m\n\`\`\``
        );
        deleteMessage(sentMessage);
        return;
      }
      clearInterval(statusInterval);
      statusInterval = null; // Reset the interval
      const sentMessage = message.channel.send(
        `\`\`\`ansi\n\x1b[35mStatus rotation stopped.\x1b[0m\n\`\`\``
      );
      deleteMessage(sentMessage);
      return;
    } else {
      const sentMessage = message.channel.send(
        `\`\`\`ansi\n\x1b[35mInvalid command. Use rstatus add <message>, rstatus remove <number>, rstatus start [watching|listening|streaming], or rstatus stop.\x1b[0m\n\`\`\``
      );
      deleteMessage(sentMessage);
      return;
    }
  },
};

function deleteMessage(sentMessage) {
  setTimeout(() => {
    if (sentMessage && sentMessage.delete) {
      sentMessage.delete().catch(console.error);
    }
  }, Math.floor(Math.random() * 6000) + 5000); // Delete after 5-10 seconds
}
