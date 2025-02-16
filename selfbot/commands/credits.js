const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "credits",
  description: "Displays information about the bot's creators and resources.",
  execute(message, args) {
    // Check if the command author is the allowed user
    if (message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission
    }

    // Delete the command message to keep things clean
    message.delete().catch(console.error);

    const creditsMessage = `\`\`\`ansi
\u001b[37m──────────────────────────────────────────────────────────────────────
\u001b[35m
    ⠀⠀⠀⣖⠲⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠉⡇⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠸⡆⠹⡀⣠⢤⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡏⠀⡧⢤⡄⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⡧⢄⣹⣅⣜⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠁⠀⢹⠚⠃⠀⠀⠀⠀⠀
    ⠀⣀⠴⢒⣉⡹⣶⣤⣀⡉⠉⠒⠒⠒⠤⠤⣀⣀⣀⠇⠀⠀⢸⠠⣄⠀⠀⠀⠀⠀
    ⠀⠈⠉⠁⠀⠀⠀⠉⠒⠯⣟⣲⠦⣤⣀⡀⠀⠀⠈⠉⠉⠉⠛⠒⠻⢥⣀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⣲⡬⠭⠿⢷⣦⣤⢄⣀⠀⠀⠚⠛⠛⠓⢦⡀
    ⠀⠀⠀⠀⠀⠀⠀⢀⣀⠤⠴⠚⠉⠁⠀⠀⠀⠀⣀⣉⡽⣕⣯⡉⠉⠉⠑⢒⣒⡾
    ⠀⠀⣀⡠⠴⠒⠉⠉⠀⢀⣀⣀⠤⡤⢶⣶⣋⠉⠉⠀⠀⠀⠈⠉⠉⠉⠉⠉⠁⠀
    ⣖⣉⣁⣠⠤⠶⡶⡶⢍⡉⠀⠀⠀⠙⠒⠯⠜⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠁⠀⠀⠀⠀⠑⢦⣯⠇
\u001b[0m
\u001b[37m──────────────────────────────────────────────────────────────────────
\u001b[37mCredits:\u001b[0m
\u001b[37m» Coded by: \u001b[31m@laceit.\u001b[0m
\u001b[37m» Discord: \u001b[34mhttps://discord.gg/A8vBTT83kz\u001b[0m
\u001b[37m» Version: \u001b[31mv1.0.0\u001b[0m
\u001b[37m» Description: \u001b[37mA multi-tool selfbot made for educational purposes.\u001b[0m
\`\`\``;

    message.reply(creditsMessage).then((msg) => {
      setTimeout(() => msg.delete(), 10000);
    });
  },
};
