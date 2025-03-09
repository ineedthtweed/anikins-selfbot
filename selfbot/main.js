const { Client, GatewayIntentBits } = require("discord.js");
const Discord = require("discord.js-selfbot-v13");
const fs = require("fs");
const path = require("path");
const config = require("/workspaces/anikins-selfbot/selfbot/config.json");

const token1 = config.token1;
const token2 = config.token2;

const client1 = new Discord.Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

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

const activeAutoReacts1 = new Map();
const activeAutoReacts2 = new Map();
module.exports = { activeAutoReacts1, activeAutoReacts2 };

const targetUsers1 = {};
const targetUsers2 = {};

const blockedContent = [
  "underage",
  "minor",
  // ... your existing list ...
];

async function mimicTask(
  client,
  targetUsers,
  user,
  message,
  cacheMessages,
  blockedContent,
  clientInstance
) {
  while (
    targetUsers[message.channel.id] &&
    targetUsers[message.channel.id].targetUserId === user.id
  ) {
    try {
      const channel = clientInstance.channels.cache.get(message.channel.id);
      const messages = await channel.messages.fetch({
        limit: 1,
      });

      if (messages.size === 0) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        continue;
      }

      const messageToMimic = messages.first();

      if (messageToMimic.author.id === user.id) {
        const content = messageToMimic.content.toLowerCase();

        if (blockedContent.includes(content)) {
          continue;
        }

        let contentToSend = messageToMimic.content;

        while (contentToSend.startsWith(".")) {
          contentToSend = contentToSend.substring(1).trim();
        }

        if (!contentToSend) {
          continue;
        }

        if (
          contentToSend.split(".").length > 2 ||
          ["!", "?", "-", "$", "/", ">", "<"].some((ch) =>
            contentToSend.startsWith(ch)
          )
        ) {
          continue;
        }

        if (cacheMessages[messageToMimic.id]) {
          continue;
        }

        cacheMessages[messageToMimic.id] = true;

        message.channel.send(contentToSend);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      await new Promise((resolve) => setTimeout(resolve, 10000));
    } catch (error) {
      console.error("Mimic Error:", error);
    }
  }
}

async function handleMessage(client, message, activeAutoReacts, targetUsers) {
  try {
    if (message.author.bot) return;

    const channelId = message.channel.id;
    const targetUser = targetUsers[channelId];

    if (!targetUser) {
      // If not mimicking, don't do anything else
    }

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content
      .slice(config.prefix.length)
      .trim()
      .split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
      command.execute(
        message,
        args,
        activeAutoReacts,
        client,
        targetUsers,
        {},
        blockedContent
      ); // Pass the client instance
    } catch (commandError) {
      console.error("Error executing command:", commandError);
      message.reply("There was an error trying to execute that command!");
    }
  } catch (overallError) {
    console.error("Error in messageCreate handler:", overallError);
  }
}

client1.on("messageCreate", async (message) => {
  await handleMessage(client1, message, activeAutoReacts1, targetUsers1);
});

client2.on("messageCreate", async (message) => {
  await handleMessage(client2, message, activeAutoReacts2, targetUsers2);
});

const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client1.commands.set(command.name, command);
  client2.commands.set(command.name, command);
}

client1.once("ready", () => {
  const magenta = "\x1b[35m";
  const reset = "\x1b[0m";

  console.log(
    `${magenta} welcome ${client1.user.tag}! to anikins selfbot ${reset}`
  );

  const commandNames = Array.from(client1.commands.keys()).filter(
    (name) => typeof name === "string"
  );
  const boxWidth =
    commandNames.length > 0
      ? Math.max(
          40,
          commandNames.reduce((max, name) => Math.max(max, name.length), 0) + 6
        )
      : 40;
  const horizontalLine = "-".repeat(boxWidth);
  const paddedBoxWidth = boxWidth - 2;

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

client2.once("ready", () => {
  const magenta = "\x1b[35m";
  const reset = "\x1b[0m";

  console.log(
    `${magenta} welcome ${client2.user.tag}! to anikins selfbot ${reset}`
  );
});

// Added global error handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
});

console.log("Environment Variables:", process.env);
client1.login(token1);
client2.login(token2);

module.exports = {
  client1,
  client2,
};