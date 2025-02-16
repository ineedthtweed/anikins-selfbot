// allcommands.js
const config = require("../config.json");

module.exports = {
  name: "allcommands",
  description:
    "Displays a list of available command categories and information.",
  execute(message, args) {
    if (message.author.id !== message.author.id) {
      return;
    }

    const helpMessage = `\`\`\`ansi

\u001b[37m               Commands 
+----------------------------------------+
| 01 | utility                        | 
| 02 | allcommands                    | 
| 03 | areply                         | 
| 04 | autoreact                      | 
| 05 | avatar                         | 
| 06 | banall                         | 
| 07 | clone                          | 
| 08 | credits                        | 
| 09 | fun                            | 
| 10 | gcfill                         | 
| 11 | gettokens                      | 
| 12 | help                           | 
| 13 | mimic                          | 
| 14 | nuke                           | 
| 15 | prefix                         | 
| 16 | purge                          | 
| 17 | raid                           | 
| 18 | rstatus                        | 
| 19 | server                         | 
| 20 | serverinfo                     | 
| 21 | setrpc                         | 
| 22 | settarget                      | 
| 23 | spam                           | 
| 24 | status                         | 
| 25 | stopareply                     | 
| 26 | stopautoreact                  | 
| 27 | stopmimic                      | 
| 28 | typing                         | 
| 29 | userinfo                       | 
| 30 | vcjoin                         | 
+----------------------------------------+
\`\`\``;

    function sendPage(pageNumber) {
      let commands = {
        1: `\`\`\`ansi

\u001b[37m               Commands
+----------------------------------------+
| \u001b[1m01\u001b[0m | \u001b[31mutility       \u001b[30m- Displays a list of available command categories and information. \u001b[37m
| \u001b[1m02\u001b[0m | \u001b[31mprefix        \u001b[30m- changes the prefix \u001b[37m
| \u001b[1m03\u001b[0m | \u001b[31mserverinfo    \u001b[30m- gets the server information \u001b[37m
| \u001b[1m04\u001b[0m | \u001b[31muserinfo      \u001b[30m- gets the users information \u001b[37m
| \u001b[1m05\u001b[0m | \u001b[31mgettokens     \u001b[30m- Sends the working tokens from tokens.txt \u001b[37m
| \u001b[1m06\u001b[0m | \u001b[31mclone         \u001b[30m- Clones channels from the specified source guild to the destination guild. \u001b[37m
| \u001b[1m07\u001b[0m | \u001b[31mhelp          \u001b[30m- Displays a list of available command categories and information. \u001b[37m
| \u001b[1m08\u001b[0m | \u001b[31msettarget     \u001b[30m- Sets the target for the bot. \u001b[37m
| \u001b[1m09\u001b[0m | \u001b[31mspam          \u001b[30m- Spams a message in the channel. \u001b[37m
| \u001b[1m10\u001b[0m | \u001b[31mstopareply    \u001b[30m- Stops the areply. \u001b[37m
| \u001b[1m11\u001b[0m | \u001b[31mstopautoreact \u001b[30m- Stops the autoreact. \u001b[37m
| \u001b[1m12\u001b[0m | \u001b[31mstopmimic     \u001b[30m- Stops the mimic command. \u001b[37m
| \u001b[1m13\u001b[0m | \u001b[31mtyping        \u001b[30m- Auto types in the channel. \u001b[37m
| \u001b[1m14\u001b[0m | \u001b[31mallcommands  \u001b[30m- Displays all commands. \u001b[37m

  \`\`\``,
        2: `\`\`\`ansi

\u001b[37m               Commands
+----------------------------------------+
| \u001b[1m15\u001b[0m | \u001b[31mbanall      \u001b[30m- Bans all members in the Server \u001b[37m
| \u001b[1m16\u001b[0m | \u001b[31mnuke         \u001b[30m- nukes the entire discord server \u001b[37m
| \u001b[1m17\u001b[0m | \u001b[31mpurge        \u001b[30m- Deletes messages for the user \u001b[37m
| \u001b[1m18\u001b[0m | \u001b[31mraid         \u001b[30m- raids the discord server \u001b[37m
| \u001b[1m19\u001b[0m | \u001b[31mserver       \u001b[30m- Provides server information. \u001b[37m
| \u001b[1m20\u001b[0m | \u001b[31mvicjoin      \u001b[30m- Joins a voice channel. \u001b[37m
| \u001b[1m21\u001b[0m | \u001b[31mestatus      \u001b[30m- emoji status rotation \u001b[37m
| \u001b[1m22\u001b[0m | \u001b[31mrstatus     \u001b[30m- Resets the status of the user \u001b[37m
| \u001b[1m23\u001b[0m | \u001b[31msetrpc       \u001b[30m- Sets the Rich Presence for the user \u001b[37m
  
  \`\`\``,
      };

      const fullMessage = `${helpMessage}\n\n**Page ${pageNumber} of Commands:**\n${commands[pageNumber]}`;

      message.channel
        .send(fullMessage)
        .then((msg) => setTimeout(() => msg.delete(), 10000));
    }

    if (args[0] === "all") {
      sendPage(1);
      sendPage(2);
    } else {
      sendPage(1);
    }
  },
};
