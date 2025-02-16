const { Client, Message } = require("discord.js-selfbot-v13");
const { choice, randint } = require("../utils");
const config = require("../config.json"); // Import config

const STAT_RESPONSES = {
  time_spent: ["24/7", "Too Much", "Never Offline", "Lives Here"],
  grass_status: ["Never", "Rarely", "Sometimes", "Often"],
  nitro_status: ["Yes", "No", "Expired"],
  friend_types: ["None", "All Bots", "Few Friends", "Many Friends"],
  pfp_types: ["Default", "Anime", "Meme", "Random Image"],
};

module.exports = {
  name: "discordreport",
  description: "Generate a humorous Discord report card for a user",
  async execute(message, args) {
    try {
      await message.delete(); // Delete the trigger message
    } catch (error) {
      // If the message cannot be deleted, log the error, but do not stop execution.  This is not critical.
      console.error("Failed to delete message:", error);
    }

    let user =
      message.mentions.members.first() ||
      (args[0]
        ? await message.guild?.members.fetch(args[0]).catch(() => null)
        : message.member);

    if (!user) {
      if (message.channel.type === "dm") {
        user = message.author;
      } else {
        await message.channel.send(`\x1b[35mUser not found.\x1b[0m`);
        return;
      }
    }

    const loading = await message.channel.send(
      `\x1b[35mGenerating Discord report card for ${user.user.username}...\x1b[0m`
    );

    const report = `DISCORD REPORT CARD FOR ${user.user.username}

Time Spent: ${choice(STAT_RESPONSES.time_spent)}
Grass Touched: ${choice(STAT_RESPONSES.grass_status)}
Discord Nitro: ${choice(STAT_RESPONSES.nitro_status)}
Server Count: ${randint(100, 999)}
DMs: ${choice(["Empty", "All Blocked", "Only Bots", "Bot Spam"])}
Friends: ${choice(STAT_RESPONSES.friend_types)}
Profile Picture: ${choice(STAT_RESPONSES.pfp_types)}
Custom Status: ${choice([
      "Cringe",
      "Bot Generated",
      "Anime Quote",
      "Discord Kitten",
    ])}
    
FINAL GRADE: F${"-".repeat(randint(1, 5))}
NOTE: ${choice([
      "Parents Disowned",
      "Touch Grass Immediately",
      "Seek Help",
      "Grass is Green",
    ])}\n\x1b[35m`;

    await new Promise((resolve) => setTimeout(resolve, 2000));
    await loading.edit({ content: report });
  },
};
