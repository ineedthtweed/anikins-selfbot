const config = require("../config.json");

module.exports = {
  name: "raiden",
  description: "Shares Raiden content",
  async execute(message, args) {
    if (message.mentions.members.size === 0) {
      return message.channel.send("Please mention a user.");
    }
    async function fetchRaiden() {
      const response = await fetch(
        "https://api.waifu.im/search/?sfw=true&query=raiden"
      ); // Corrected query for Raiden
      const data = await response.json();
      return data.url;
    }

    fetchRaiden()
      .then((url) => {
        message.channel.send(url);
      })
      .catch((error) => {
        console.error("Error fetching Raiden content:", error);
        message.channel.send(
          "Failed to fetch Raiden content.  Please try again later."
        );
      });
  },
};
