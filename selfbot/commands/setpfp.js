const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "setpfp",
  description: "Set the bot's profile picture",
  async execute(message, args) {
    if (message.author.id !== config.userId) {
      return message.channel.send(`why is bro tryna use my selfbot?`);
    }

    const url = args[0];
    if (!url) {
      return message.channel.send(
        "Please provide a URL for the new profile picture."
      );
    }

    const fetch = (await import("node-fetch")).default;

    const headers = {
      authority: "discord.com",
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      authorization: message.client.token,
      "content-type": "application/json",
      origin: "https://discord.com",
      referer: "https://discord.com/channels/@me",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15",
      "x-debug-options": "bugReporterEnabled",
      "x-discord-locale": "en-US",
      "x-super-properties":
        "eyJvcyI6Ik1hYyBPUyBYIiwiYnJvd3NlciI6IlNhZmFyaSIsImRldmljZSI6IiIsInN5c3RlbV9sb2NhbGUiOiJlbi1VUyIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzYwNS4xLjE1IChLSFRNTCwgbGlrZSBHZWNrbykgVmVyc2lvbi8xNi41IFNhZmFyaS82MDUuMS4xNSIsImJyb3dzZXJfdmVyc2lvbiI6IjE2LjUiLCJvc192ZXJzaW9uIjoiMTAuMTUuNyIsInJlZmVycmVyIjoiIiwicmVmZXJyaW5nX2RvbWFpbiI6IiIsInJlZmVycm5nX2RvbWFpbl9jdXJyZW50IjoiIiwiY2xpZW50X2J1aWxkX251bWJlciI6MjUwNjg0LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==",
    };

    try {
      const response = await fetch(url);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const image_b64 = Buffer.from(arrayBuffer).toString("base64");
        const content_type = response.headers.get("content-type");
        const image_format = content_type.includes("gif") ? "gif" : "png";

        const payload = {
          avatar: `data:image/${image_format};base64,${image_b64}`,
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
          await message.channel.send("Successfully set profile picture");
        } else {
          await message.channel.send(
            `Failed to update profile picture: ${updateResponse.status}`
          );
        }
      } else {
        await message.channel.send("Failed to download image from URL");
      }
    } catch (error) {
      console.error(error);
      await message.channel.send(
        "An error occurred while setting profile picture"
      );
    }
  },
};
