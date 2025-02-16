const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "fun",
  description: "Displays the fun commands.",

  execute(message, args) {
    if (message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission
    }

    const credits = `\`\`\`ansi
\u001b[37m                                              
\u001b[37m[4] \u001b[31m avatar \u001b[30m - gets the users avatar \u001b[37m
\u001b[37m[5] \u001b[31m banner \u001b[30m - gets the users banner \u001b[37m
\u001b[37m[6] \u001b[31m fuck \u001b[30m - fucks the mentioned user \u001b[37m
\u001b[37m[7] \u001b[31m autoreact \u001b[30m - reacts to the users messages  \u001b[37m
\u001b[37m[8] \u001b[31m stopautoreact \u001b[30m - stops autoreacting  . \u001b[37m

\u001b[37m─────────────────────────────────────────────────────────────────────────────────────────────────────────────
\u001b[35m 
                                  ⠀⠀⠀⠀⠀⠀⢀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⣠⠾⠛⠶⣄⢀⣠⣤⠴⢦⡀⠀⠀⠀⠀
                                  ⠀⠀⠀⠀⠀⠀⢠⡿⠉⠉⠉⠛⠶⠶⠖⠒⠒⣾⠋⠀⢀⣀⣙⣯⡁⠀⠀⣿⠀⠀⠀⠀
                                  ⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⢸⡏⠀⠀⢯⣼⠋⠉⠙⢶⠞⠛⠻⣆⠀⠀⠀
                                  ⠀⠀⠀⠀⠀⠀⢸⣧⠆⠀⠀⠀⠀⠀⠀⠀⠻⣦⣤⡤⢿⡀⠀⢀⣼⣷⠀⠀⣽⠀⠀⠀
                                  ⠀⠀⠀⠀⠀⠀⣼⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⢏⡉⠁⣠⡾⣇⠀⠀⠀
                                  ⠀⠀⠀⠀⠀⢰⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠋⠉⠀⢻⡀⠀⠀
                                  ⠀⠀⠀⠀⣀⣠⣼⣧⣤⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠐⠖⢻⡟⠓⠒
                                  ⠀⠀⠀⠀⠀⠈⣷⣀⡀⠀⠘⠿⠇⠀⠀⠀⢀⣀⣀⠀⠀⠿⠿⠟⠀⠀⠲⣾⠦⢤⠀
                                  ⠀⠀⠀⠀⠀⠀⠈⣧⣀⡀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠀⢀⣀⣀⣀⣀⣤⣸⣿⠀⠀⠀
                                  ⠀⠀⠀⠀⠀⠀⠀⠈⢻⣷⣄⣀⠀⠀⠀⠀⠀⠀⣤⣤⡾⢋⣵⣦⣴⣶⣿⣧⡀⠀⠀
                                  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⣾⣛⠙⠛⠻⢿⠿⣙⣿⣾⣷
                                  ⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣻⣷⣤⡻⡞⣹⣿⡇⠀
                                  ⠀⠀⠀⠀⢀⣤⡴⠖⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⡿⠋⠉⠉⠁⠀⡟⠀⠀
                                  ⠀⠀⠀⠀⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠳⣄⡀⢠⣠⣾⡿⠀⠀
                                  ⠀⠀⠀⠀⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠻⠛⠁⠀⠀
                                  ⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
\u001b[0m
\u001b[37mPage 1/1 - Help \u001b[31mcoming soon]\u001b[37m\u001b[37mdiscord][\u001b[31mhttps://discord.gg/A8vBTT83kz\u001b[37m] Made by [@laceit.]           
\`\`\``;

    message.reply(credits).then((msg) => {
      setTimeout(() => msg.delete(), 10000);
    });
  },
};
