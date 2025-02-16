const config = require("../config.json");

module.exports = {
  name: "uniform",
  description: "Shares some uniform content",
  async execute(message, args) {
    const member = message.mentions.members.first();
    async function fetchUniform() {
      const response = await fetch('https://api.waifu.im/search/?included_tags=uniform&is_nsfw=true');
      if (response.ok) {
        const data = await response.json();
        const image_url = data.images[0].url;
        await message.channel.send(`\`${message.author.username} shares some uniform content\`\n[birth sb](${image_url})`);
      } else {
        await message.channel.send("```Failed to fetch image, try again later!```");
      }
    }
    fetchUniform();
  }
};