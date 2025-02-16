const config = require('../config.json'); // Ensure you have your config file for user ID
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'gettokens',
    description: 'Sends the tokens from tokens.txt formatted in ANSI to the chat (INSECURE! FOR TESTING ONLY!)',
    
    category: 'utility',
    async execute(message, args) {
        if (message.author.id !== config.userId) {
              return message.reply(`\`\`\`ansi\n\x1b[31mYou do not have permission to use this command.\x1b[0m\n\`\`\``);
          }
        // Define the path to the tokens.txt file
        const tokensPath = path.join(__dirname, '..', 'tokens.txt');

        // Check if the file exists
        if (!fs.existsSync(tokensPath)) {
            return message.reply("tokens.txt file is not found.");
        }

        try {
            // Read the tokens.txt file asynchronously
            fs.readFile(tokensPath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading tokens.txt:', err);
                    return message.reply('There was an error reading the tokens file.');
                }

                // Split the file content by new lines, remove empty lines
                const tokens = data.split('\n').filter(token => token.trim() !== '');

                // Prepare the ANSI formatted message
                if (tokens.length === 0) {
                    message.channel.send('No tokens found in tokens.txt');
                } else {
                    const ansiMessage = tokens.map((token, index) => {
                        return `Token [${index + 1}]: ${token.trim()}`;
                    }).join('\n');

                    // Send the formatted message to the chat
                    message.channel.send(ansiMessage);
                }
            });
        } catch (error) {
            console.error(error);
            message.reply('An unexpected error occurred.');
        }
    },
};
