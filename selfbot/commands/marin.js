const config = require("../config.json");

module.exports = {
  name: "marin",
  description: "Shares Marin content",
  async execute(message, args) {
    async function fetchMarin() {
      const response = await fetch("https://nekos.best/api/marin"); // Corrected the fetch URL
      const data = await response.json(); // Parse the JSON response
      return data.url; // Returns the URL of the image.
    }

    fetchMarin()
      .then((url) => {
        message.channel.send(url); // Send the image URL
      })
      .catch((error) => {
        console.error("Error fetching Marin content:", error);
        message.channel.send(
          "Failed to fetch Marin content. Please try again later."
        );
      });
  },
};
