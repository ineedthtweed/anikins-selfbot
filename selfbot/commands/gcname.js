const { Client, Intents } = require("discord.js-selfbot-v13");
const client = new Client();
const random = require("random");
const config = require("../config.json"); // Ensure you have your config file for user ID

let ugc_task = null;

const self_gcname = [
  "https://discord.gg/A8vBTT83kz runs you LMFAO",
  "yo {user} wake the fuck up https://discord.gg/A8vBTT83kz",
  "nigga your a bitch {user} https://discord.gg/A8vBTT83kz",
  "pedophilic retard {user} https://discord.gg/A8vBTT83kz",
  "{UPuser} STOP RUBBING YOUR NIPPLES LOL https://discord.gg/A8vBTT83kz",
  "{UPuser} LOOOL HAILK DO SOMETHING RETARD https://discord.gg/A8vBTT83kz",
  "{user} come die to anikin nigga https://discord.gg/A8vBTT83kz",
  "{UPuser} ILL CAVE YOUR SKULL IN https://discord.gg/A8vBTT83kz",
  "frail bitch https://discord.gg/A8vBTT83kz",
  "{UPuser} I WILL KILL YOU LMFAO https://discord.gg/A8vBTT83kz",
  "{user} nigga your slow as shit https://discord.gg/A8vBTT83kz",
  "YO {user} WAKE THE FUCK UP https://discord.gg/A8vBTT83kz",
  "DONT FAIL THE CHECK {UPuser} LOL https://discord.gg/A8vBTT83kz",
  "who let this shitty nigga own a client?? https://discord.gg/A8vBTT83kz",
  "faggot bitch stop rubbing your nipples to little girls https://discord.gg/A8vBTT83kz",
  "leave = fold okay {user}? LMFAO https://discord.gg/A8vBTT83kz",
  "{user} this shit isnt a dream LMFAO https://discord.gg/A8vBTT83kz",
];

module.exports = {
  name: "ugc",
  description: "Starts the group chat name changer",
  async execute(message, args) {
    const user = message.mentions.users.first();
    if (!user) {
      return message.channel.send("Please mention a user.");
    }

    if (ugc_task !== null) {
      return message.channel.send(
        "```Group chat name changer is already running```"
      );
    }

    if (message.channel.type !== "GROUP_DM") {
      return message.channel.send(
        "```This command can only be used in group chats.```"
      );
    }

    const name_changer = async () => {
      let counter = 1;
      let unused_names = [...self_gcname];

      while (true) {
        try {
          if (unused_names.length === 0) {
            unused_names = [...self_gcname];
          }

          const base_name = unused_names.splice(
            Math.floor(Math.random() * unused_names.length),
            1
          )[0];
          const formatted_name = base_name
            .replace("{user}", user.username)
            .replace("{UPuser}", user.username.toUpperCase());
          const new_name = `${formatted_name} ${counter}`;

          await client.api.channels(message.channel.id).patch({
            data: { name: new_name },
          });

          await new Promise((resolve) => setTimeout(resolve, 100));
          counter++;
        } catch (e) {
          if (e.message.includes("429")) {
            // Rate limit
            const retry_after = e.message.match(/retry_after":(\d+)/)[1];
            await new Promise((resolve) =>
              setTimeout(resolve, retry_after * 1000)
            );
            continue;
          } else {
            await message.channel.send(`Error: ${e.message}`);
            break;
          }
        }
      }
    };

    ugc_task = name_changer();
    await message.channel.send("```Group chat name changer started```");
  },
};

client.on("messageCreate", async (message) => {
  if (message.content.startsWith(config.prefix + "ugcend")) {
    if (ugc_task === null) {
      return message.channel.send(
        "```Group chat name changer is not currently running```"
      );
    }

    ugc_task = null;
    await message.channel.send("```Group chat name changer stopped```");
  }
});

client.login(config.token1);
