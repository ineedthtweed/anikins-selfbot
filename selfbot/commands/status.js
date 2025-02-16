const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "status",
  description:
    "Displays a list of available status-related commands and information.",
  execute(message, args) {
    if (message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission
    }
    const statusCommands = `\`\`\`ansi
\u001b[35m─────────────────────────────────────────────────────────────────────────────────────────────────────────────\u001b[0m
\u001b[37m
\u001b[37m[1]  \u001b[31msetrs \u001b[30m- sets a rotation status \u001b[37m
\u001b[37m[2]  \u001b[31mrstatus \u001b[30m- Rotates through a list of status messages  \u001b[37m
\u001b[37m[3]  \u001b[31mrstatus add\u001b[30m- add a message to your  rotation \u001b[37m
\u001b[37m[4]  \u001b[31mrstatus stop\u001b[30m- stops rotating your status  \u001b[37m
\u001b[37m[5]  \u001b[31mrstatus start\u001b[30m- starts the status rotation  \u001b[37m



\u001b[35m─────────────────────────────────────────────────────────────────────────────────────────────────────────────\u001b[0m
\u001b[35m
\u001b[35m    ░░░░░░███████ ]▄▄▄▄▄▄▄▄
\u001b[35m    ▂▄▅█████████▅▄▃▂        
\u001b[35m   [███████████████████]. 
\u001b[35m   
\u001b[37mPage 1/1 - Help \u001b[31mcoming soon]\u001b[37m\u001b[37mdiscord][\u001b[31mhttps://discord.gg/A8vBTT83kz\u001b[37m] Made by [@laceit.]         
\`\`\``;

    message.channel.send(statusCommands).then((msg) => {
      setTimeout(() => msg.delete(), 10000);
    });
  },
};
