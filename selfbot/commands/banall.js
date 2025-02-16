const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "banall",
  description: "Bans all members in the server (excluding certain members).",
  async execute(message, args) {
    if (message.author.id !== config.userId) {
      return message.channel.send(`why is bro tryna use my selfbot?`);
    }

    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.channel.send("You do not have permission to ban members.");
    }

    if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
      return message.channel.send("I do not have permission to ban members.");
    }

    const confirmationMessage = await message.channel.send(
      'Are you sure you want to ban all members? Type "yes" to confirm, or "no" to cancel.'
    );

    const filter = (response) => {
      return (
        response.author.id === message.author.id &&
        (response.content.toLowerCase() === "yes" ||
          response.content.toLowerCase() === "no")
      );
    };

    const collected = await message.channel
      .awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] })
      .catch((err) => {
        confirmationMessage.delete();
        message.channel.send("You did not respond in time, action canceled.");
      });

    if (!collected || collected.first().content.toLowerCase() === "no") {
      confirmationMessage.delete();
      return message.channel.send("Mass ban canceled.");
    }

    confirmationMessage.delete(); // Delete the confirmation message

    const members = await message.guild.members.fetch();
    let bannedCount = 0;
    let failedBans = [];

    for (const member of members.values()) {
      if (member.id === message.client.user.id) continue; // Skip the bot itself
      if (member.id === message.guild.ownerId) continue; // Skip the owner
      if (member.permissions.has("ADMINISTRATOR")) continue; // Skip admins

      try {
        await member.ban({
          reason: "Mass ban initiated by " + message.author.tag,
        });
        bannedCount++;
      } catch (error) {
        console.error(`Failed to ban ${member.user.tag}:`, error);
        failedBans.push(member.user.tag);
      }
    }

    let response = `Successfully banned ${bannedCount} members.`;
    if (failedBans.length > 0) {
      response += `\nFailed to ban: ${failedBans.join(", ")}`;
    }

    message.channel.send(response);
  },
};
