const { Client, GatewayIntentBits } = require("discord.js");
const Discord = require("discord.js-selfbot-v13"); // Be very careful with self-bots!
const fs = require("fs");
const path = require("path");
const config = require("./config.json");

// Load tokens from config
const token1 = config.token1;
const token2 = config.token2;

// Create the first client
const client1 = new Discord.Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Create the second client
const client2 = new Discord.Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client1.commands = new Map();
client2.commands = new Map();

const activeAutoReacts1 = new Map(); // Context ID -> (User ID -> Set of Emojis)
const activeAutoReacts2 = new Map(); // Context ID -> (User ID -> Set of Emojis)
module.exports = { activeAutoReacts1, activeAutoReacts2 };

// In-memory storage for target users. Keyed by channel ID
const targetUsers1 = {};
const targetUsers2 = {};

async function handleMessage(client, message, activeAutoReacts, targetUsers) {
  try {
    if (message.author.bot) return;

    const channelId = message.channel.id;
    const targetUser = targetUsers[channelId]; // Get the target user for the current channel

    if (targetUser && message.author.id === targetUser.targetUserId) {
      // If the message author is the target user
      const replies = `# ANIKIN OWNS YOU`; // Format the reply message
      try {
        await message.reply(replies); // Use reply API for threads context
        console.log(
          `Replied to <@${targetUser.targetUserId}> in channel ${channelId}`
        );
      } catch (error) {
        console.error("Failed to send reply:", error);
      }
    } else if (!targetUser) {
    }

    // Continue processing commands, reactions, etc.
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content
      .slice(config.prefix.length)
      .trim()
      .split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
      command.execute(message, args, activeAutoReacts, client, targetUsers); // Pass client and targetUsers
    } catch (commandError) {
      console.error("Error executing command:", commandError);
      message.reply("There was an error trying to execute that command!");
    }
  } catch (overallError) {
    console.error("Error in messageCreate handler:", overallError);
  }
}

// Message Create Listeners for both clients
client1.on("messageCreate", async (message) => {
  await handleMessage(client1, message, activeAutoReacts1, targetUsers1);
});

client2.on("messageCreate", async (message) => {
  await handleMessage(client2, message, activeAutoReacts2, targetUsers2);
});

// Load commands - This is done only once and the same commands are used for both clients
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client1.commands.set(command.name, command);
  client2.commands.set(command.name, command);
}

// Ready event for client1
client1.once("ready", () => {
  const magenta = "\x1b[35m"; // ANSI escape code for magenta
  const reset = "\x1b[0m"; // ANSI escape code to reset color

  console.log(`${magenta}Client 1 Logged in as ${client1.user.tag}!${reset}`);

  // Log commands in a box, excluding "N/A" and ensuring all commands are shown
  const commandNames = Array.from(client1.commands.keys()).filter(
    (name) => typeof name === "string"
  ); // Filter out non-string command names
  const boxWidth =
    commandNames.length > 0
      ? Math.max(
          40,
          commandNames.reduce((max, name) => Math.max(max, name.length), 0) + 6
        )
      : 40; // Minimum width or largest command length + padding
  const horizontalLine = "-".repeat(boxWidth); // Horizontal line for the box
  const paddedBoxWidth = boxWidth - 2; // Width inside the box

  console.log(`${magenta}+${horizontalLine}+${reset}`);
  console.log(
    `${magenta}|${" Commands ".padStart(
      Math.floor(paddedBoxWidth / 2) + 5,
      " "
    )}|${reset}`
  );
  console.log(`${magenta}+${horizontalLine}+${reset}`);

  let count = 1;
  for (const commandName of commandNames) {
    console.log(
      `${magenta}| ${count.toString().padStart(2, "0")} | ${commandName.padEnd(
        paddedBoxWidth - 8
      )} | ${reset}`
    );
    count++;
  }

  console.log(`${magenta}+${horizontalLine}+${reset}`);
});

// Ready event for client2
client2.once("ready", () => {
  const magenta = "\x1b[35m"; // ANSI escape code for magenta
  const reset = "\x1b[0m"; // ANSI escape code to reset color

  console.log(`${magenta}Client 2 Logged in as ${client2.user.tag}!${reset}`);

  // No need to print commands twice, it's the same set for both clients
});

// Log in both clients
client1.login(token1);

module.exports = {
  client1,
};
