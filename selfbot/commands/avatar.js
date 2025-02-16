const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "avatar",
  description: "Gets the user's avatar.",
  async execute(message, args, client, activeAutoReacts) {
    if (message.author.id !== config.userId) {
      return message.channel.send(`why is bro tryna use my selfbot?`);
    }

    try {
      await message.delete();
    } catch (err) {
      console.error("Failed to delete the message:", err);
    }

    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser) {
      const reply = await message.reply("mention a user to get their avatar.");
      setTimeout(() => reply.delete().catch(console.error), 5000); // Reply and delete after 5 seconds
      return;
    }

    const avatarEmbed = mentionedUser.displayAvatarURL({
      dynamic: true,
      size: 1024,
    });
    message.channel.send(` ${mentionedUser.username}'s avatar: ${avatarEmbed}`);
  },
};
