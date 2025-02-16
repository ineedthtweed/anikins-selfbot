const config = require("../config.json"); // Ensure you have your config file for user ID
const { Client } = require("discord.js-selfbot-v13");
const client = new Client();
const random = require("random");
const { on } = require("stream");

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
  name: "ugckill",
  description: "Stops the group chat name changer",
  async execute(message, args) {
    if (ugc_task === null) {
      return message.channel.send(
        "```Group chat name changer is not running.```"
      );
    }

    ugc_task = null; // Stop the loop
    await message.channel.send("```Group chat name changer stopped```");
  },
};

client.login(config.token1);
