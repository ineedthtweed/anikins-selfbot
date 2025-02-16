const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "serverinfo",
  description: "Displays information about the server.",
  async execute(message, args) {
    execute(message, args);
    if (message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission
    }
    try {
      const guild = message.guild;

      // Server Info Text
      const serverInfo = `\`\`\`ansi
\u001b[35m─────────────────────────────────────────────────────────────────────────────────────────────────────────────\u001b[0m
\u001b[37mServer Name: \u001b[35m${guild.name}\u001b[37m
\u001b[37mServer ID: \u001b[35m${guild.id}\u001b[37m
\u001b[37mOwner: \u001b[35m${(await guild.fetchOwner()).user.tag}\u001b[37m
\u001b[37mCreated At: \u001b[35m${guild.createdAt.toUTCString()}\u001b[37m
\u001b[37mMember Count: \u001b[35m${guild.memberCount}\u001b[37m
\u001b[37mVerification Level: \u001b[35m${guild.verificationLevel}\u001b[37m
\u001b[37mBoost Count: \u001b[35m${guild.premiumSubscriptionCount}\u001b[37m
\u001b[37mBoost Tier: \u001b[35m${guild.premiumTier}\u001b[37m
\u001b[37mText Channels: \u001b[35m${
        guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size
      }\u001b[37m
\u001b[37mVoice Channels: \u001b[35m${
        guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size
      }\u001b[37m
\u001b[37mRoles: \u001b[35m${guild.roles.cache.size}\u001b[37m
\u001b[37mEmojis: \u001b[35m${guild.emojis.cache.size}\u001b[37m
\u001b[35m─────────────────────────────────────────────────────────────────────────────────────────────────────────────\u001b[0m
\`\`\``;

      // Send the Server Information Text
      message.channel.send(serverInfo);

      // Send the Server Images (Icon and Banner) in a different message
      const serverImages = [];
      if (guild.iconURL({ dynamic: true, size: 4096 })) {
        serverImages.push({
          name: "Server Icon",
          url: guild.iconURL({ dynamic: true, size: 4096 }),
        });
      }
      if (guild.bannerURL({ dynamic: true, size: 4096 })) {
        serverImages.push({
          name: "Server Banner",
          url: guild.bannerURL({ dynamic: true, size: 4096 }),
        });
      }

      if (serverImages.length > 0) {
        let imageMessage = ``;
        for (const image of serverImages) {
          imageMessage += `${image.name}:\n${image.url}\n`;
        }
        await message.channel.send(imageMessage);
      }
    } catch (error) {
      console.error("Error fetching server info:", error);
      message.channel.send("Failed to fetch server information.");
    }
  },
};
