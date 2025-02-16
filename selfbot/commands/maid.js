const config = require("../config.json");

module.exports = {
  name: "maid",
  description: "Shares some maid content",
  async execute(message, args) {
    async function fetchMaid() {
      const response = await fetch('https://api.waifu.im/search/?included_tags=maid&is_nsfw=true');
      if (response.ok) {
        const data = await response.json();
        const image_url = data.images[0].url;
        await message.channel.send(`\`${message.author.username} shares some maid content\`\n[birth sb](${image_url})`);
      } else {
        await message.channel.send("```Failed to fetch image, try again later!```");
      }
    }
    fetchMaid();
  }
};