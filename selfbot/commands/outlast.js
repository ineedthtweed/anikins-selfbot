const { Client, Intents } = require("discord.js");
const random = require("random"); // Keep this, it's used for randomness.  However, we are not using it right
const config = require("../config.json");
const outlast_messages = [
  "i own your bitchass son keep talking",
  "daddies almost finish fuck nigga",
  "goodboy beat your meat for me",
  "little fucking slut cmbucket",
  "KYS NOW LITTLE NIGGER LMAO BITCH NIGGA",
  "SLAVE CUNT HOLY SHIT YOUR ASS",
  "# < LOL CREEPY FUCK GO HANG URSELF MY SON DIED",
  "# YOURE NOT A MATCH FOR ME BITCH ASS NIGGA ",
  "# BREAK YO BONE SAND THROWS UR BODY  YOU LITTLE CUM DUMPSTER ",
  "#  LITTLE WHOREE     PUSSY SLUT ANIKIN OWNS YOU",
];

let outlast_running = false;
let outlast_tasks = {};

module.exports = {
  name: "outlast",
  description: "Spam messages at a user until stopped.",
  async execute(message, args, activeAutoReacts, client) {
    if (message.author.id !== client.user.id) {
      return; // Do nothing if the user doesn't have permission
    }
    if (!user) {
      return message.reply("Please mention a user to outlast");
    }

    if (outlast_running) {
      return message.channel.send(
        "```An outlast session is already running```"
      );
    }

    outlast_running = true;
    let counter = 1;
    let consecutive_failures = 0;
    const max_consecutive_failures = 5;

    async function outlast_loop() {
      while (outlast_running) {
        try {
          // Use random.choice to select a random message from the array
          const outlast_message =
            outlast_messages[
              Math.floor(Math.random() * outlast_messages.length)
            ]; // Fixed this line.
          try {
            const sentMessage = await message.channel.send(
              `${user} ${outlast_message}\n\`\`\`${counter}\`\`\``
            );
            counter++;
            consecutive_failures = 0;
            deleteMessage(sentMessage);
            await new Promise((resolve) => setTimeout(resolve, 660));
          } catch (e) {
            if (e.status === 429) {
              const retry_after = e.retryAfter;
              console.log(`Rate limited, waiting ${retry_after} seconds...`);
              await new Promise((resolve) =>
                setTimeout(resolve, retry_after * 1000 + 500)
              );
            } else {
              consecutive_failures++;
              console.log(`HTTP Error: ${e}`);
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
          if (consecutive_failures >= max_consecutive_failures) {
            console.log("Too many consecutive failures, stopping outlast");
            outlast_running = false;
            const sentMessage = await message.channel.send(
              "```Outlast stopped due to too many errors```"
            );
            deleteMessage(sentMessage);
            break;
          }
        } catch (e) {
          console.log(`Error in outlast loop: ${e}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    try {
      // We don't need setInterval anymore, and we should call the function directly and let it loop.
      outlast_loop(); // start the loop.
      const sentMessage = await message.channel.send(
        `\`\`\`Started outlast on ${user.username}\`\`\``
      );
      deleteMessage(sentMessage);
    } catch (e) {
      outlast_running = false;
      console.log(`Failed to start outlast: ${e}`);
      const sentMessage = await message.channel.send(
        "```Failed to start outlast.```"
      );
      deleteMessage(sentMessage);
    }
  },
};

function deleteMessage(message) {
  setTimeout(() => {
    try {
      message.delete().catch((err) => {
        console.error("Error deleting message:", err);
      });
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  }, 3000);
}
