// commands/settarget.js
const commandSetTarget = {
    name: 'settarget',
    description: 'Set the target user for auto-reply.',
    async execute(message, args, activeAutoReacts, client, targetUsers) {
        const targetUserId = message.mentions.users.first()?.id; // Get the mentioned user's ID
        if (!targetUserId) {
            return message.reply('You need to mention a user!');
        }

        // Set the target user for the current channel
        targetUsers[message.channel.id] = { targetUserId: targetUserId };
        console.log(`Target user set for channel ${message.channel.id}: ${targetUserId}`);
         return message.reply(`\`\`\`ansi\n\x1b[31m${targetUserId}  is now set as areply target\x1b[0m\n\`\`\``);
    },
};

module.exports = commandSetTarget;