const { Client } = require("discord.js-selfbot-v13");
const fs = require("fs");
const config = require("../config.json"); // Import config

// Function to load tokens from a file
function loadTokens(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data.split("\n").filter(Boolean);
  } catch (err) {
    console.error(`Error reading tokens from file: ${err}`);
    return [];
  }
}

module.exports = {
  name: "gcfill",
  description:
    "Add users from tokens to the specified group chat using an invite link",
  async execute(message, args) {
    if (message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission
    }

    const tokensFilePath = "selfbot/tokens.txt";
    const tokens = loadTokens(tokensFilePath);

    if (tokens.length === 0) {
      await message.channel.send(
        "```No tokens found in the file. Please check the token file.```"
      );
      return;
    }

    const inviteLink = args[0];
    if (!inviteLink) {
      await message.channel.send(
        "```Please provide a group chat invite link.```"
      );
      return;
    }

    const limitedTokens = tokens.slice(0, 20);

    async function addTokenToGC(token) {
      try {
        const userClient = new Client({ checkUpdate: false });

        userClient.once("ready", async () => {
          try {
            const invite = userClient.guilds.cache
              .get()
              .channels.cache.get()
              .fetchInvite(inviteLink);
            await invite.accept();
            console.log(`Added ${userClient.user.tag} to the group chat`);
            await message.channel.send(
              `\`\`\`Added ${userClient.user.tag} to the group chat\`\`\``
            );
          } catch (e) {
            console.error(
              `Error adding user with token ${token.slice(-4)}: ${e}`
            );
          } finally {
            await userClient.destroy();
          }
        });

        await userClient.login(token);
      } catch (e) {
        console.error(`Failed to process token ${token.slice(-4)}: ${e}`);
      }
    }

    const tasks = limitedTokens.map((token) => addTokenToGC(token));
    await Promise.all(tasks);

    await message.channel.send(
      `\`\`\`Attempted to add ${limitedTokens.length} tokens to the group chat using the provided invite link. Please check your token.txt file and try again if the bot was not able to add everyone.\`\`\``
    );
  },
};
