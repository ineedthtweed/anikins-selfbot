const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "setbanner",
  description: "Set the bot's banner",
  async execute(message, args) {
    if (message.author.id !== config.userId) {
      return message.channel.send(`why is bro tryna use my selfbot?`);
    }

    const url = args[0];
    if (!url) {
      return message.channel.send("Please provide a URL for the new banner.");
    }

    const fetch = (await import("node-fetch")).default;

    const headers = {
      authority: "discord.com",
      method: "PATCH",
      scheme: "https",
      accept: "/",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US",
      authorization: message.client.token,
      origin: "https://discord.com/",
      "sec-ch-ua": '"Not/A)Brand";v="99", "Brave";v="115", "Chromium";v="115"',
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
        "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC45MDIwIiwib3NfdmVyc2lvbiI6IjEwLjAuMTkwNDUiLCJvc19hcmNoIjoieDY0IiwiYXBwX2FyY2giOiJpYTMyIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV09XNjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIGRpc2NvcmQvMS4wLjkwMjAgQ2hyb21lLzEwOC4wLjUzNTkuMjE1IEVsZWN0cm9uLzIyLjMuMjYgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6IjIyLjMuMjYiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjoyNDAyMzcsIm5hdGl2ZV9idWlsZF9udW1iZXIiOjM4NTE3LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==",
    };

    try {
      const response = await fetch(url);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const image_b64 = Buffer.from(arrayBuffer).toString("base64");
        const content_type = response.headers.get("content-type");
        const image_format = content_type.includes("gif") ? "gif" : "png";

        const payload = {
          banner: `data:image/${image_format};base64,${image_b64}`,
        };

        const updateResponse = await fetch(
          "https://discord.com/api/v9/users/@me",
          {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(payload),
          }
        );

        if (updateResponse.ok) {
          await message.channel.send("Successfully set banner");
        } else {
          await message.channel.send(
            `Failed to update banner: ${updateResponse.status}`
          );
        }
      } else {
        await message.channel.send("Failed to download image from URL");
      }
    } catch (error) {
      console.error(error);
      await message.channel.send("An error occurred while setting banner");
    }
  },
};
