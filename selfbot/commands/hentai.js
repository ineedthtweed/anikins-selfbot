const config = require("../config.json");

module.exports = {
  name: "hentai",
  description: "Shares some hentai content",
  async execute(message, args) {
    if (message.mentions.members.size === 0) {
      return message.channel.send("Please mention a user.");
    }
    async function fetchHentai() {
      const response = await fetch('https://api.waifu.im/search/?included_tags=hentai&is_nsfw=true');
      if (response.ok) {
        const data = await response.json();
        const image_url = data.images[0].url;
        await message.channel.send(`\`${message.author.username} shares some hentai\`\n[birth sb](${image_url})`);
      } else {
        await message.channel.send("```Failed to fetch image, try again later!```");
      }
    }
    fetchHentai();
  }
};