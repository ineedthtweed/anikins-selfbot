const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "utility",
  description:
    "Displays a list of available command categories and information.",
  execute(message, args) {
    if (message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission
    }
    const utility = `\`\`\`ansi
        \u001b[37m     
        \u001b[37m[1]  \u001b[31mprefix    \u001b[30m- changes the prefix \u001b[37m
        \u001b[37m[2]  \u001b[31mtyping    \u001b[30m- auto types in the channel  \u001b[37m
        \u001b[37m[3]  \u001b[31mserverinfo    \u001b[30m- gets the server information \u001b[37m
        \u001b[37m[4]  \u001b[31muserinfo      \u001b[30m- gets the users information         \u001b[37m
        \u001b[37m[5]  \u001b[31mgettokens     \u001b[30m- Sends the working tokens from tokens.txt           \u001b[37m

            ──────────────────────────────────────────────────────────────────────────
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

    message.channel.send(utility).then((msg) => {
      setTimeout(() => msg.delete(), 10000);
    });
  },
};
