module.exports = {
  name: "stopmimic",
  description: "Stop mimicking a user's messages",
  execute: async (message, args, activeAutoReacts, client, targetUsers) => {
    execute(message, args);
    if (message.author.id !== config.userId) {
      return; // Do nothing if the user doesn't have permission
    }
    if (!message.mentions.users.size) {
      return message.reply("Please mention a user to stop mimicking");
    }

    const user = message.mentions.users.first();

    if (
      targetUsers[message.channel.id] &&
      targetUsers[message.channel.id].targetUserId === user.id
    ) {
      targetUsers[message.channel.id].task.cancel();
      delete targetUsers[message.channel.id];
      return message.reply(`Stopped mimicking ${user.username}`);
    } else {
      return message.reply(`Not currently mimicking ${user.username}`);
    }
  },
};
