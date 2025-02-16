const { PermissionsBitField } = require('discord.js');
const config = require('../config.json'); // Ensure you have your config file for user ID

module.exports = {
    name: 'nuke',
    description: 'Deletes all channels and roles in a server.',
    async execute(message, args) {
        // Check if the user is your user ID to allow only you to use this command
        if (message.author.id !== config.userId) {
            return message.channel.send(`\`\`\`ansi\n\x1b[31mYou do not have permission to use this command.\x1b[0m\n\`\`\``);
        }

        // Check for Administrator permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.channel.send(`\`\`\`ansi\n\x1b[35mYou must have administrator permission to use this command.\x1b[0m\n\`\`\``);
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.channel.send(`\`\`\`ansi\n\x1b[35mI need administrator permission to operate.\x1b[0m\n\`\`\``);
        }

        const confirmationMessage = await message.channel.send('Are you sure you want to nuke this server? Type "yes" to confirm, or "no" to cancel.');

        const filter = response => {
            return response.author.id === message.author.id && (response.content.toLowerCase() === 'yes' || response.content.toLowerCase() === 'no');
        };

        const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).catch(err => {
            confirmationMessage.delete();
            message.channel.send('You did not respond in time, action canceled.');
        });

        if (!collected || collected.first().content.toLowerCase() === 'no') {
            confirmationMessage.delete();
            return message.channel.send('Nuke canceled.');
        }

        confirmationMessage.delete(); // Delete the confirmation message

        try {
            // Delete all channels
            const channels = message.guild.channels.cache;
            for (const channel of channels.values()) {
                try {
                    await channel.delete('Nuke process: deleting all channels');
                } catch (error) {
                    console.error(`\x1b[35mError deleting channel ${channel.name}:\x1b[0m`, error); // Magenta error message
                }
            }

            // Delete all roles
            const roles = message.guild.roles.cache;
            for (const role of roles.values()) {
                try {
                    if (role.id !== message.guild.id) { // Skip the @everyone role
                        await role.delete('Nuke process: deleting all roles');
                    }
                } catch (error) {
                    console.error(`\x1b[35mError deleting role ${role.name}:\x1b[0m`, error); // Magenta error message
                }
            }

            // Send success message
            message.channel.send(`\`\`\`ansi\n\x1b[32mServer successfully nuked.\x1b[0m\n\`\`\``);
        } catch (error) {
            console.error(`\x1b[35mError nuking server:\x1b[0m`, error); // Magenta error message
            message.channel.send(`\`\`\`ansi\n\x1b[35mAn unexpected error occurred while nuking the server.\x1b[0m\n\`\`\``);
        }
    },
};