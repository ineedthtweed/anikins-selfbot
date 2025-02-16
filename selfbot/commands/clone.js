const { PermissionsBitField, ChannelType } = require("discord.js");
const config = require("../config.json"); // Ensure you have your config file for user ID

module.exports = {
  name: "servercloner",
  description:
    "Clones categories, channels, roles, and emojis from the specified source guild to the destination guild.",
  async execute(message, args) {
    if (message.author.id !== config.userId) return; // Do nothing if the user doesn't have permission

    if (args.length < 2) {
      return message.channel.send(
        "Usage: servercloner <sourceGuildID> <destinationGuildID>"
      );
    }

    const sourceGuildID = args[0];
    const destinationGuildID = args[1];

    const sourceGuild = message.client.guilds.cache.get(sourceGuildID);
    const destinationGuild =
      message.client.guilds.cache.get(destinationGuildID);

    if (!sourceGuild) {
      return message.channel.send("Unable to find the source guild.");
    }

    if (!destinationGuild) {
      return message.channel.send("Unable to find the destination guild.");
    }

    async function cloneCategories() {
      try {
        for (const category of sourceGuild.channels.cache
          .filter((c) => c.type === ChannelType.GuildCategory)
          .values()) {
          await destinationGuild.channels.create({
            name: category.name,
            type: ChannelType.GuildCategory,
            position: category.position,
            permissionOverwrites: category.permissionOverwrites.cache.map(
              (permission) => ({
                id: permission.id,
                allow: permission.allow.bitfield,
                deny: permission.deny.bitfield,
              })
            ),
          });
        }
        message.channel.send(
          `\`\`\`ansi\n\x1b[32mSuccessfully cloned categories from ${sourceGuild.name} to ${destinationGuild.name}.\x1b[0m\n\`\`\``
        );
      } catch (error) {
        console.error("Error cloning categories:", error);
        message.channel.send(
          `\`\`\`ansi\n\x1b[35mAn error occurred while cloning categories:\n${error.message}\x1b[0m\n\`\`\``
        );
      }
    }

    async function cloneChannels() {
      try {
        for (const channel of sourceGuild.channels.cache
          .filter((c) => c.type !== ChannelType.GuildCategory)
          .values()) {
          const parent = destinationGuild.channels.cache.find(
            (c) =>
              c.name === channel.parent?.name &&
              c.type === ChannelType.GuildCategory
          );
          const clonedChannel = await destinationGuild.channels.create({
            name: channel.name,
            type: channel.type,
            topic: channel.topic,
            nsfw: channel.nsfw,
            parent: parent ? parent.id : null,
            position: channel.position,
            permissionOverwrites: channel.permissionOverwrites.cache.map(
              (permission) => ({
                id: permission.id,
                allow: permission.allow.bitfield,
                deny: permission.deny.bitfield,
              })
            ),
          });
          await clonedChannel.setPosition(channel.position);
        }
        message.channel.send(
          `\`\`\`ansi\n\x1b[32mSuccessfully cloned channels from ${sourceGuild.name} to ${destinationGuild.name}.\x1b[0m\n\`\`\``
        );
      } catch (error) {
        console.error("Error cloning channels:", error);
        message.channel.send(
          `\`\`\`ansi\n\x1b[35mAn error occurred while cloning channels:\n${error.message}\x1b[0m\n\`\`\``
        );
      }
    }

    async function cloneRoles() {
      try {
        for (const role of sourceGuild.roles.cache
          .filter((r) => r.name !== "@everyone")
          .values()) {
          await destinationGuild.roles.create({
            name: role.name,
            color: role.color,
            hoist: role.hoist,
            position: role.position,
            permissions: role.permissions.bitfield,
            mentionable: role.mentionable,
          });
        }
        message.channel.send(
          `\`\`\`ansi\n\x1b[32mSuccessfully cloned roles from ${sourceGuild.name} to ${destinationGuild.name}.\x1b[0m\n\`\`\``
        );
      } catch (error) {
        console.error("Error cloning roles:", error);
        message.channel.send(
          `\`\`\`ansi\n\x1b[35mAn error occurred while cloning roles:\n${error.message}\x1b[0m\n\`\`\``
        );
      }
    }

    async function cloneEmojis() {
      try {
        for (const emoji of sourceGuild.emojis.cache.values()) {
          await destinationGuild.emojis.create(emoji.url, emoji.name);
        }
        message.channel.send(
          `\`\`\`ansi\n\x1b[32mSuccessfully cloned emojis from ${sourceGuild.name} to ${destinationGuild.name}.\x1b[0m\n\`\`\``
        );
      } catch (error) {
        console.error("Error cloning emojis:", error);
        message.channel.send(
          `\`\`\`ansi\n\x1b[35mAn error occurred while cloning emojis:\n${error.message}\x1b[0m\n\`\`\``
        );
      }
    }

    await cloneCategories();
    await cloneChannels();
    await cloneRoles();
    await cloneEmojis();
  },
};
