// Command: areply <target user>
// File: commands/areply.js

module.exports = {
    name: 'areply',
    description: 'Sets a user to be replied to automatically whenever they send a message.',
    async execute(message, args, activeAutoReacts, client, targetUsers) { // Added client and targetUsers
        if (message.author.id !== client.user.id) {
            return; // Self-bot only
        }

        const mentionedUser = message.mentions.users.first();

        if (!mentionedUser) {
             return message.reply(`\`\`\`ansi\n\x1b[31mmention a user to reply to\x1b[0m\n\`\`\``);
        }

        // Determine which client is executing the command
        const isClient1 = client.user.id === global.client1?.user?.id; // Compare user IDs
        const activeTargetUsers = isClient1 ? global.targetUsers1 : global.targetUsers2; // Select appropriate targetUsers object


        // Set the mentioned user as the target for this channel
        targetUsers[message.channel.id] = {
            targetUserId: mentionedUser.id
        };
         return message.reply(`\`\`\`ansi\n\x1b[31mnow replying to  ${mentionedUser}\x1b[0m\n\`\`\``);

        // Delete original message
        try {
            await message.delete();
        } catch (error) {
            console.error('Failed to delete the message:', error);
        }
    },
};