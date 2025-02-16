const config = require("../config.json");

module.exports = {
  name: "help",
  description:
    "Displays a list of available command categories and information.",
  execute(message, args) {
    if (!config || !config.userId || message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission or the config is missing
    }

    const credits2 = `\`\`\`ansi
\u001b[35m
\u001b[36m WELCOME TO ANIKINS SELFBOT v.1 | your prefix is  '${config.prefix}' 
\`\`\``;

    message.channel.send(credits2).then((msg) => {
      setTimeout(() => msg.delete(), 10000);
    });

    const credits = `\`\`\`ansi
\u001b[35m
  \u001b[0m
 \u001b[35m────────────────────────────────────────────────────────────────────────────────────────────────────────────
 \u001b[35m 
 \u001b[35m         [1]  \u001b[36mUTILITY    \u001b[0m- sends a bunch of utility commands  \u001b[35m
 \u001b[35m         [2]  \u001b[36mFUN      \u001b[0m- Sends a bunch of fun commands         \u001b[35m
 \u001b[35m         [3]  \u001b[36mCREDITS     \u001b[0m- Sends credits info etc       \u001b[35m
 \u001b[35m         [4]  \u001b[36mSTATUS      \u001b[0m- Sends a bunch of Status commands           \u001b[35m
 \u001b[35m         [5]  \u001b[36mSERVER      \u001b[0m- Sends a bunch of server commands           \u001b[35m

 \u001b[35m────────────────────────────────────────────────────────────────────────────────────────────────────────────
 \u001b[0m
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
    \u001b[35m
    \u001b[37m Page 1/1 - Help \u001b[31mcoming soon\u001b[37m               \u001b[37mdiscord [ \u001b[31mhttps://discord.gg/A8vBTT83kz\u001b[37m ]             Made by [@laceit.]         
\`\`\``;
    message.channel.send(credits).then((msg) => {
      setTimeout(() => msg.delete(), 10000);
    });
  },
};
