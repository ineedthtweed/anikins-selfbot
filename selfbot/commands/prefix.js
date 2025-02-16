const fs = require("fs");
const path = require("path");

let configData; // Variable to store configuration

// Load config data initially
const loadConfig = () => {
  const configPath = path.join(__dirname, "..", "./config.json");
  try {
    configData = JSON.parse(fs.readFileSync(configPath));
  } catch (error) {
    console.error("Error loading config:", error);
  }
};

// Function to update the command handler if necessary
function updateCommandHandler(newPrefix, client) {
  // Here we will update the client's event listeners with the new prefix
  client.removeAllListeners("message"); // Remove existing listeners
  console.log(`Removed all message listeners.`);
  // Re-add the listener with the new prefix
  client.on("message", (message) => {
    // Prevent the bot from responding to other bots
    if (message.author.bot) return;
    // Selfbot always responds to his own messages
    if (message.author.id !== client.user.id) return;

    // Check if the message starts with the current prefix
    if (!message.content.startsWith(newPrefix)) return;

    // Extract command and arguments
    const args = message.content.slice(newPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Get the command from the commands collection
    const command = client.commands.get(commandName);

    // Check if the command exists
    if (!command) return;

    // Execute the command
    try {
      command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.channel.send(
        `\`\`\`ansi\n\x1b[35mThere was an error trying to execute that command!\x1b[0m\n\`\`\``
      );
    }
  });
  console.log(`Command handler updated with new prefix: ${newPrefix}`);
}

module.exports = {
  name: "prefix",
  description: "Change the prefix of the selfbot",
  category: "utility",
  execute(message, args, client) {
    if (message.author.id !== config.userId) {
      return message.reply(
        `\`\`\`ansi\n\x1b[31mYou do not have permission to use this command.\x1b[0m\n\`\`\``
      );
    }
    if (!args.length) {
      return message.channel.send(
        `\`\`\`ansi\n\x1b[35mYou need to provide a new prefix!\x1b[0m\n\`\`\``
      );
    }

    const newPrefix = args[0];
    const configPath = path.join(__dirname, "..", "config.json");

    try {
      const oldPrefix = configData.prefix; // Store the old prefix
      configData.prefix = newPrefix;
      fs.writeFileSync(configPath, JSON.stringify(configData, null, 4));
      message.channel.send(
        `\`\`\`ansi\n\x1b[35mPrefix updated from: ${oldPrefix} to: ${newPrefix}\x1b[0m\n\`\`\``
      );

      // Update the command handler with the new prefix
      updateCommandHandler(newPrefix, client);
    } catch (error) {
      console.error("Error updating prefix:", error);
      message.channel.send(
        `\`\`\`ansi\n\x1b[35mThere was an error updating the prefix.\x1b[0m\n\`\`\``
      );
    }
  },
};

// Function to load configuration data
loadConfig();
