const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "server",
  description:
    "Displays a list of available command categories and information.",
  execute(message, args) {
    if (message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission
    }
    const credits = `\`\`\`ansi
        \u001b[37m─────────────────────────────────────────────────────────────────────────────────────────────────────────────\u001b[0m
        \u001b[37m
        \u001b[37m[1]  \u001b[31mnuke      \u001b[30m- Nukes the server, deleting all channels and roles \u001b[37m
        \u001b[37m[2]  \u001b[31mmassdm\u001b[30m- Mass invites tokens from tokens.txt to the server  \u001b[37m
        \u001b[37m[3]  \u001b[31mclone  \u001b[30m- clones a server                       \u001b[37m
        \u001b[37m[4]  \u001b[31mbanall  \u001b[30m- bans all users in a server                            \u001b[37m
        \u001b[37m[5]  \u001b[31mserverinfo\u001b[30m- renames every user in the server to a name you select\u001b[37m
    ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
    \u001b[35m
        ░░░░░░███████ ]▄▄▄▄▄▄▄▄
        ▂▄▅█████████▅▄▃▂        
       [███████████████████]. 
       ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤..
    \u001b[37mPage 1/1 - Help \u001b[31mcoming soon\u001b[37m \u001b[31mhttps://discord.gg/A8vBTT83kz\u001b[37m:            Made by [@laceit.]         
\`\`\``;

    message.channel.send(credits);
  },
};
