module.exports = {
  name: "stopoutlast",
  description: "Stop the current outlast session.",
  async execute(message, args) {
    if (!outlast_running) {
      return message.channel.send(
        "```No outlast session is currently running.```"
      );
    }

    outlast_running = false;

    const sentMessage = await message.channel.send(
      "```Outlast session stopped.```"
    );
    deleteMessage(sentMessage);
  },
};

function deleteMessage(message) {
  setTimeout(() => {
    try {
      message.delete().catch((err) => {
        console.error("Error deleting message:", err);
      });
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  }, 3000);
}
