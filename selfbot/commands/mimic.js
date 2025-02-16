const { setTimeout } = require("timers");
const path = require("path");
const fs = require("fs");
const config = require("/project/workspace/selfbot/config.json"); // Consider changing this path if needed.

module.exports = {
  name: "mimic",
  description: "Mimic a user's messages",

  execute: async (
    message,
    args,
    activeAutoReacts,
    client,
    targetUsers,
    cacheMessages,
    blockedContent
  ) => {
    if (!args[0]) {
      return message.reply("Please mention a user to mimic");
    }

    if (message.author.id !== client.user.id) {
      return; // Do nothing if the user doesn't have permission
    }
    const user = message.mentions.users.first();

    if (!user) {
      return message.reply("Invalid user");
    }

    if (
      targetUsers[message.channel.id] &&
      targetUsers[message.channel.id].targetUserId === user.id
    ) {
      // Stop mimicking
      if (targetUsers[message.channel.id].task) {
        clearInterval(targetUsers[message.channel.id].task);
      }
      delete targetUsers[message.channel.id];
      return message.reply(`Stopped mimicking ${user.username}`);
    }

    const channel = client.channels.cache.get(message.channel.id);

    if (!channel) {
      return message.reply("Could not find the channel.");
    }

    // Start mimicking
    if (!targetUsers[message.channel.id]) {
      targetUsers[message.channel.id] = {
        targetUserId: user.id,
        task: setInterval(
          () =>
            mimicTask(
              client,
              targetUsers,
              user,
              message,
              cacheMessages,
              blockedContent
            ),
          1000
        ), // Mimic every second
      };

      channel.send(`Started mimicking ${user.username}`);
    }

    function mimicTask(
      client,
      targetUsers,
      user,
      message,
      cacheMessages,
      blockedContent
    ) {
      const targetUserId = targetUsers[message.channel.id].targetUserId;
      if (!targetUserId) return;

      const userMessages = cacheMessages.filter(
        (msg) => msg.author.id === targetUserId
      );
      if (userMessages.length === 0) return;

      const lastMessage = userMessages[userMessages.length - 1];

      if (!lastMessage) return;

      // Check for blocked content before sending.
      if (
        blockedContent &&
        blockedContent.some((word) =>
          lastMessage.content.toLowerCase().includes(word)
        )
      ) {
        return; // Skip sending the message if blocked content is found.
      }

      message.channel
        .send(lastMessage.content)
        .then(() => {
          // Optional: Add a small delay to avoid spamming
          // setTimeout(() => {
          //     message.channel.send(lastMessage.content);
          // }, 500);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  },
};
