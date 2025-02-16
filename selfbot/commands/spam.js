module.exports = {
    name: 'spam',
    description: 'Spams a message a specified number of times, then deletes the command message.',
    async execute(message, args) {
        // Ensure the command is only executed by the user running the self-bot
        if (message.author.id !== message.client.user.id) {
            return; // Do nothing if the message author is not the bot's user
        }

        // Parse arguments
        const numberOfTimes = parseInt(args[0]);
        const messageToSpam = args.slice(1).join(' ');

        // Validate input
        if (isNaN(numberOfTimes) || numberOfTimes <= 0 || numberOfTimes > 20) {
            return message.reply('Please provide a valid number between 1 and 20.');
        }

        if (!messageToSpam) {
            return message.reply('Please provide a message to spam.');
        }

        // Spam the message
        for (let i = 0; i < numberOfTimes; i++) {
            await message.channel.send(messageToSpam);
        }

        // Delete the original command message
        try {
            await message.delete();
        } catch (error) {
            console.error('Failed to delete the message:', error);
            message.channel.send('Could not delete the original command message.');
        }
    },
};