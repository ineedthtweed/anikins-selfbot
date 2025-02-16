const { Client } = require("discord.js-selfbot-v13");
const fs = require("fs");
const config = require("../config.json"); // Import config

const defaultLadderMessages = [
  "I am above you",
  "ANIIN FUCING OWNS YOU",
  "MY FUCKING SON LOOK AT HIM TRYING",
  "# LOL YOU'RE ALMOST THERE SON",
  "# ANIKIN OWNS YOU",
];

let ladderMessages = [...defaultLadderMessages];
let ladderDelay = 0.2;
let ladderEnabled = false;
let ladderTask = null;
let ladderTarget = null;

function saveLadderMessages() {
  fs.writeFileSync("ladder_messages.json", JSON.stringify(ladderMessages));
}

function loadLadderMessages() {
  try {
    ladderMessages = JSON.parse(fs.readFileSync("ladder_messages.json"));
  } catch (e) {
    ladderMessages = [...defaultLadderMessages];
    saveLadderMessages();
  }
}

loadLadderMessages();

module.exports = {
  name: "ladder",
  description: "Manage ladder spam messages",
  async execute(message, args) {
    const subcommand = args[0]?.toLowerCase();
    await message.delete(); // Delete the trigger message

    if (subcommand === undefined) {
      if (ladderEnabled) {
        await message.channel.send("```Ladder spam is already running```");
        return;
      }

      ladderEnabled = true;
      ladderTarget = message.mentions.users.first();

      const ladderSpam = async () => {
        while (ladderEnabled) {
          try {
            const msg =
              ladderMessages[Math.floor(Math.random() * ladderMessages.length)];
            const words = msg.split(" ");

            for (const word of words) {
              if (ladderTarget && Math.random() < 0.2) {
                await message.channel.send(`${word} ${ladderTarget}`);
              } else {
                await message.channel.send(word);
              }
              await new Promise((resolve) =>
                setTimeout(resolve, ladderDelay * 1000)
              );
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
          } catch (e) {
            console.error(`Error sending ladder message: ${e}`);
          }
        }
      };

      ladderTask = ladderSpam();
      await message.channel.send(
        `\`\`\`Ladder spam started${
          ladderTarget ? ` targeting ${ladderTarget.username}` : ""
        }\`\`\``
      );
    } else {
      switch (subcommand) {
        case "stop":
          if (!ladderEnabled) {
            await message.channel.send("```Ladder spam is not running```");
            return;
          }
          ladderEnabled = false;
          ladderTarget = null;
          if (ladderTask) {
            ladderTask = null;
          }
          await message.channel.send("```Ladder spam stopped```");
          break;

        case "add":
          const addMessage = args.slice(1).join(" ");
          if (ladderMessages.includes(addMessage)) {
            await message.channel.send("```This message already exists```");
            return;
          }
          ladderMessages.push(addMessage);
          saveLadderMessages();
          await message.channel.send(`\`\`\`Added: ${addMessage}\`\`\``);
          break;

        case "remove":
          const removeMessage = args.slice(1).join(" ");
          if (!ladderMessages.includes(removeMessage)) {
            await message.channel.send("```Message not found```");
            return;
          }
          ladderMessages = ladderMessages.filter(
            (msg) => msg !== removeMessage
          );
          saveLadderMessages();
          await message.channel.send(`\`\`\`Removed: ${removeMessage}\`\`\``);
          break;

        case "list":
          const messages = ladderMessages
            .map((msg, i) => `${i + 1}. ${msg}`)
            .join("\n");
          await message.channel.send(
            `\`\`\`Ladder Messages:\n\n${messages}\`\`\``
          );
          break;

        case "delay":
          const delay = parseFloat(args[1]);
          if (isNaN(delay) || delay < 0.2) {
            await message.channel.send(
              "```Delay must be at least 0.2 seconds```"
            );
            return;
          }
          ladderDelay = delay;
          await message.channel.send(
            `\`\`\`Ladder delay set to ${delay}s\`\`\``
          );
          break;

        case "reset":
          ladderMessages = [...defaultLadderMessages];
          saveLadderMessages();
          await message.channel.send("```Reset to default ladder messages```");
          break;

        case "clear":
          ladderMessages = [];
          saveLadderMessages();
          await message.channel.send("```Cleared all ladder messages```");
          break;

        case "status":
          const status = `\`\`\`Ladder Status\nEnabled: ${ladderEnabled}\nTarget: ${
            ladderTarget ? ladderTarget.username : "None"
          }\nDelay: ${ladderDelay}s\`\`\``;
          await message.channel.send(status);
          break;

        default:
          await message.channel.send("```Invalid subcommand.```");
      }
    }
  },
};
