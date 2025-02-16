const config = require("../config.json"); // Ensure you have your config file for user ID
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args)); // Use dynamic import to support ESM
const { Client } = require("discord.js-selfbot-v13"); // Remove Intents, as Selfbots don't use them.
const client = new Client(); // Removed Intents as Selfbots don't use them.

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

module.exports = {
  name: "massdm",
  description: "Send a message to multiple friends",
  async execute(message, args, activeAutoReacts, client) {
    if (message.author.id !== client.user.id) {
      return; // Do nothing if the user doesn't have permission
    }

    const numFriends = parseInt(args[0]);
    const messageContent = args.slice(1).join(" ");

    if (isNaN(numFriends) || numFriends <= 0) {
      return message.channel.send("Please provide a valid number of friends.");
    }

    if (!messageContent) {
      return message.channel.send("Please provide a message to send.");
    }

    await message.delete();

    const send_message_to_friend = async (friend_id, friend_username) => {
      const headers = {
        authority: "discord.com",
        method: "POST", // Use POST for creating a DM channel
        scheme: "https",
        accept: "/",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US",
        authorization: message.client.token,
        origin: "https://discord.com/",
        "sec-ch-ua":
          '"Not/A)Brand";v="99", "Brave";v="115", "Chromium";v="115"',
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9020 Chrome/108.0.5359.215 Electron/22.3.26 Safari/537.36",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "X-Debug-Options": "bugReporterEnabled",
        "X-Discord-Locale": "en-US",
        "X-Discord-Timezone": "Asia/Calcutta",
        "X-Super-Properties":
          "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC45MDIwIiwib3NfdmVyc2lvbiI6IjEwLjAuMTkwNDUiLCJvc19hcmNoIjoieDY0IiwiYXBwX2FyY2giOiJpYTMyIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV09XNjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIGRpc2NvcmQvMS4wLjkwMjAgQ2hyb21lLzEwOC4wLjUzNTkuMjE1IEVsZWN0cm9uLzIyLjMuMjYgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6IjIyLjMuMjYiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjoyNDAyMzcsIm5hdGl2ZV9idWlsZF9udW1iXIiOjM4NTE3LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==",
      };

      try {
        const response = await fetch(
          `https://discord.com/api/v9/users/@me/channels`,
          {
            method: "POST", // Use POST to create a DM channel
            headers: headers,
            body: JSON.stringify({ recipient_id: friend_id }),
          }
        );

        if (response.status === 403) {
          const data = await response.json();
          if ("captcha_key" in data || "captcha_sitekey" in data) {
            console.log("CAPTCHA detected! Stopping mass DM...");
            return [false, "CAPTCHA"];
          }
        }

        if (response.status >= 200 && response.status < 300) {
          const dm_channel = await response.json();
          const channel_id = dm_channel.id;

          const msg_response = await fetch(
            `https://discord.com/api/v9/channels/${channel_id}/messages`,
            {
              method: "POST",
              headers: headers,
              body: JSON.stringify({ content: messageContent }),
            }
          );

          if (msg_response.status === 403) {
            const data = await msg_response.json();
            if ("captcha_key" in data || "captcha_sitekey" in data) {
              return [false, "CAPTCHA"];
            }
            return [false, "BLOCKED"];
          } else if (msg_response.status === 429) {
            return [false, "RATELIMIT"];
          } else if (msg_response.status >= 200 && msg_response.status < 300) {
            return [true, "SUCCESS"];
          } else {
            return [false, `ERROR_${msg_response.status}`];
          }
        }

        return [false, "FAILED"];
      } catch (error) {
        return [false, `ERROR: ${error.message}`];
      }
    };

    const status_msg = await message.channel.send(
      "```ansi\nInitializing Mass DM Operation...```"
    );

    try {
      const response = await fetch(
        "https://discord.com/api/v9/users/@me/relationships",
        {
          headers: { authorization: message.client.token },
        }
      );

      if (response.status !== 200) {
        await status_msg.edit("```ansi\nFailed to fetch friends list```");
        return;
      }

      let friends = await response.json();
      if (!Array.isArray(friends)) {
        await status_msg.edit("```ansi\nInvalid response format```");
        return;
      }

      friends = friends.filter((f) => f.type === 1);

      if (friends.length === 0) {
        await status_msg.edit("```ansi\nNo friends found```");
        return;
      }

      friends = friends.slice(0, numFriends);

      const stats = {
        success: 0,
        blocked: 0,
        ratelimited: 0,
        captcha: 0,
        failed: 0,
      };

      const start_time = new Date().getTime();

      for (let index = 0; index < friends.length; index++) {
        const friend = friends[index];
        const friend_id = friend.user.id;
        const friend_username = `${friend.user.username}#${friend.user.discriminator}`;

        const [success, status] = await send_message_to_friend(
          friend_id,
          friend_username
        );

        if (success) {
          stats.success += 1;
        } else if (status === "BLOCKED") {
          stats.blocked += 1;
        } else if (status === "RATELIMIT") {
          stats.ratelimited += 1;
        } else if (status === "CAPTCHA") {
          stats.captcha += 1;
          break; // Stop further processing if CAPTCHA encountered
        } else {
          stats.failed += 1;
        }

        const elapsed_time = new Date().getTime() - start_time;
        const progress = ((index + 1) / friends.length) * 100;
        const msgs_per_min = (index + 1) / (elapsed_time / 60000);
        const eta =
          (elapsed_time / (index + 1)) * (friends.length - (index + 1));

        const bar_length = 20;
        const filled = Math.floor((progress / 100) * bar_length);
        const bar = "█".repeat(filled) + "░".repeat(bar_length - filled);

        const status_content = `\`\`\`ansi
Mass DM Progress
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: [${bar}] ${progress.toFixed(1)}%
Successful: ${stats.success} Blocked: ${stats.blocked} Rate Limited: ${
          stats.ratelimited
        }
Captcha: ${stats.captcha} Failed: ${stats.failed}

Messages/min: ${msgs_per_min.toFixed(1)}
Elapsed Time: ${Math.floor(elapsed_time / 1000)}s
ETA: ${Math.floor(eta / 1000)}s

Current: ${friend_username}
Status: ${status}\`\`\``;

        await status_msg.edit(status_content);

        if ((index + 1) % 5 === 0) {
          const delay = Math.random() * (60 - 30) + 30;
          await new Promise((resolve) => setTimeout(resolve, delay * 1000));
        } else {
          await new Promise((resolve) =>
            setTimeout(resolve, (Math.random() * (12 - 8) + 8) * 1000)
          );
        }
      }

      const final_time = new Date().getTime() - start_time;
      const final_status = `\`\`\`ansi
Mass DM Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Successful: ${stats.success}
Blocked: ${stats.blocked}
Rate Limited: ${stats.ratelimited}
Captcha: ${stats.captcha}
Failed: ${stats.failed}

Total Time: ${Math.floor(final_time / 1000)}s\`\`\``;

      await status_msg.edit(final_status);
    } catch (error) {
      console.error(error);
      await status_msg.edit(
        "```ansi\nAn error occurred during the mass DM operation. Check console for details.```"
      );
    }
  },
};
