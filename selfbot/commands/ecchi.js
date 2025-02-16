const config = require("../config.json");

module.exports = {
  name: "ecchi",
  description: "Shares some ecchi content",
  async execute(message, args) {
    if (message.mentions.members.size === 0) {
      return message.channel.send("Please mention a user.");
    }
    async function fetchEcchi() {
      const response = await fetch('https://api.waifu.im/search/?included_tags=ecchi&is_nsfw=true');
      if (response.ok) {
        const data = await response.json();
        const image_url = data.images[0].url;
        await message.channel.send(`\`${message.author.username} shares some ecchi\`\n[birth sb](${image_url})`);
      } else {
        await message.channel.send("```Failed to fetch image, try again later!```");
      }
    }
    fetchEcchi();
  }
};