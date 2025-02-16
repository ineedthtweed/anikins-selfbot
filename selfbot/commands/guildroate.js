const { Client } = require("discord.js-selfbot-v13");
const fs = require("fs");
const config = require("../config.json"); // Import config
const axios = require("axios");

let guildRotationTask = null;
let guildRotationDelay = 2.0;

module.exports = {
  name: "rotateguild",
  description: "Rotate guilds for the selfbot",
  async execute(message, args) {
    const subcommand = args[0]?.toLowerCase();

    if (subcommand === undefined) {
      const delay = parseFloat(args[1] || "2.0");
      if (guildRotationTask) {
        await message.channel.send("```Guild rotation is already running```");
        return;
      }

      if (delay < 1.0) {
        await message.channel.send("```Delay must be at least 1 second```");
        return;
      }

      guildRotationDelay = delay;

      const rotateGuilds = async () => {
        const headers = {
          authority: "canary.discord.com",
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          authorization: config.token,
          "content-type": "application/json",
          origin: "https://canary.discord.com",
          referer: "https://canary.discord.com/channels/@me",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "x-super-properties":
            "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyMC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTIwLjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjI1MDgzNiwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=",
        };

        try {
          const validGuildIds = [];
          const guildsResp = await axios.get(
            "https://canary.discord.com/api/v9/users/@me/guilds",
            { headers }
          );
          const guilds = guildsResp.data;

          for (const guild of guilds) {
            const testPayload = {
              identity_guild_id: guild.id,
              identity_enabled: true,
            };

            try {
              const testResp = await axios.put(
                "https://canary.discord.com/api/v9/users/@me/clan",
                testPayload,
                { headers }
              );
              if (testResp.status === 200) {
                validGuildIds.push(guild.id);
              }
            } catch (e) {
              console.error(`Failed to test guild ${guild.id}: ${e}`);
            }
          }

          if (!validGuildIds.length) {
            await message.channel.send(
              "```No guilds with valid clan badges found```"
            );
            guildRotationTask = null; // Clear the task on no valid guilds
            return;
          }

          await message.channel.send(
            `\`\`\`Found ${validGuildIds.length} guilds\`\`\``
          );

          while (guildRotationTask !== null) {
            //Check if the task has been cancelled
            for (const guildId of validGuildIds) {
              const payload = {
                identity_guild_id: guildId,
                identity_enabled: true,
              };

              try {
                await axios.put(
                  "https://canary.discord.com/api/v9/users/@me/clan",
                  payload,
                  { headers }
                );
                await new Promise((resolve) =>
                  setTimeout(resolve, guildRotationDelay * 1000)
                );
              } catch (e) {
                console.error(`Failed to rotate guild ${guildId}: ${e}`);
              }
            }
          }
        } catch (e) {
          console.error(`Error in guild rotation: ${e}`);
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      };

      guildRotationTask = rotateGuilds();
      await message.channel.send(
        `\`\`\`Started guild rotation (Delay: ${delay}s)\`\`\``
      );
    } else {
      switch (subcommand) {
        case "stop":
          if (guildRotationTask) {
            guildRotationTask = null;
            await message.channel.send("```Stopped guild rotation```");
          } else {
            await message.channel.send("```Guild rotation is not running```");
          }
          break;

        case "delay":
          const delay = parseFloat(args[1]);
          if (isNaN(delay) || delay < 1.0) {
            await message.channel.send("```Delay must be at least 1 second```");
            return;
          }
          guildRotationDelay = delay;
          await message.channel.send(
            `\`\`\`Guild rotation delay set to ${delay}s\`\`\``
          );
          break;

        case "status":
          const status = guildRotationTask !== null ? "running" : "stopped";
          await message.channel.send(`\`\`\`
Guild Rotation Status:
• Status: ${status}
• Delay: ${guildRotationDelay}s
\`\`\``);
          break;

        default:
          await message.channel.send("```Unknown guild rotation command.```");
          break;
      }
    }
  },
};
