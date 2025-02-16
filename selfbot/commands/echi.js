const config = require("../config.json");

module.exports = {
  name: "ecchi",
  description: "Shares some ecchi content",
  async execute(message, args) {
    const member = message.mentions.members.first();
    async function fetchEcchi() {
      const response = await aiohttp.get(
        "https://api.waifu.im/search/?included_tags=ecchi&is_nsfw=true"
      );
      if (response.status === 200) {
        const data = await response.json();
        const image_url = data.images[0].url;
        await message.channel.send(
          `\`${message.author.username} shares some ecchi\`\n[birth sb](${image_url})`
        );
      } else {
        await message.channel.send(
          "```Failed to fetch image, try again later!```"
        );
      }
    }
    fetchEcchi();
  },
};
