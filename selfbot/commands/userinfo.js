const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "userinfo",
  description: "Displays information about a user.",
  async execute(message, args) {
    // Added async to handle message deletion
    if (!config || !config.userId || message.author.id !== config.userId) {
      // Added check for config and userId
      return; // Do nothing if the user doesn't have permission or config is missing
    }

    const { MessageEmbed } = require("discord.js");

    // Get the mentioned user or the author of the message
    const user = message.mentions.users.first() || message.author;

    // Check if the message is in a guild
    if (message.guild) {
      // Get the member object from the user
      const member = message.guild.members.cache.get(user.id);

      // If member isn't found, return.
      if (!member) {
        return message.channel.send("Could not find member in this server.");
      }

      // Get the number of mutual guilds
      const mutualGuildsCount = message.client.guilds.cache.filter((guild) =>
        guild.members.cache.has(user.id)
      ).size;

      // Check if the user has nitro
      const hasNitro = member.premiumSince ? "✅" : "❌";

      //get date joined
      const dateJoined = member.joinedAt
        ? member.joinedAt.toISOString().replace("T", " ").substr(0, 19)
        : "N/A"; // Handle potential null/undefined joinedAt

      // Create the user info string
      const userInfo = `\u001b[35m
                ──────────────────────────────────────────────────────────────────────────
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
                    ⠀⠀⠀⠀⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠻⠛⠁⠀
                    ──────────────────────────────────────────────────────────────────────────             ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
    
    User Info:
      Username     : ${user.username}
      User ID      : ${user.id}
      Tag          : ${user.tag}
      Created At   : ${user.createdAt
        .toISOString()
        .replace("T", " ")
        .substr(0, 19)} UTC
      Date Joined  : ${dateJoined} UTC
      Nitro Status : ${hasNitro}
      Mutual Guilds: ${mutualGuildsCount} mutual guild(s)}
    \u001b[0m         
`;

      // Send the user info and avatar
      message.channel.send(`\`\`\`ansi\n${userInfo}\n\`\`\``);
      message.channel.send(
        `${user.displayAvatarURL({ dynamic: true, size: 1024 })}`
      );
    } else {
      // Create the user info string
      const userInfo = `\u001b[35m
─────────────────────────────────────────────────────────────────────────────────────────────────────────────
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

            User Info:
              Username     : ${user.username}
              User ID      : ${user.id}
              Tag          : ${user.tag}
              Created At   : ${user.createdAt
                .toISOString()
                .replace("T", " ")
                .substr(0, 19)} UTC
            \u001b[0m      
`;
      // Send the user info and avatar
      message.channel.send(`\`\`\`ansi\n${userInfo}\n\`\`\``);
      message.channel.send(
        `${user.displayAvatarURL({ dynamic: true, size: 1024 })}`
      );
    }
    try {
      await message.delete(); // Added await and changed to async function
    } catch (error) {
      console.error("Failed to delete the message:", error);
    }
  },
};
