const {
  joinVoiceChannel,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
const { Client, Intents } = require("discord.js-selfbot-v13");
const config = require("../config.json"); // Import config

module.exports = {
  name: "vcjoin",
  description: "Manage voice channel connections.",
  async execute(message, args, activeAutoReacts, client) {
    if (message.author.id !== client.user.id) {
      return; // Do nothing if the user doesn't have permission
    }
    if (!message.guild) {
      return message.reply("This command can only be used in a server/guild.");
    }

    const subcommand = args[0]?.toLowerCase();

    switch (subcommand) {
      case "stable": {
        if (args.length < 2) {
          return message.reply("Please provide a voice channel ID.");
        }

        const channelId = args[1];
        const channel = client.channels.cache.get(channelId);

        if (!channel || channel.type !== "GUILD_VOICE") {
          return message.reply("Invalid voice channel ID.");
        }

        try {
          const connection = await joinVoiceChannel({
            channelId: channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
          });

          connection.on(VoiceConnectionStatus.Ready, () => {
            message.reply(`Connected to ${channel.name}`);
          });

          connection.on("error", (error) => {
            console.error("Error connecting to voice channel:", error);
            message.reply(
              `Error connecting to voice channel: ${error.message}`
            );
          });
        } catch (error) {
          console.error("Error connecting to voice channel:", error);
          message.reply(`Error connecting to voice channel: ${error.message}`);
        }
        break;
      }

      case "list": {
        if (
          message.guild.channels.cache.filter((c) => c.type === "GUILD_VOICE")
            .size === 0
        ) {
          return message.reply("No voice channels available.");
        }

        const channelList = message.guild.channels.cache
          .filter((channel) => channel.type === "GUILD_VOICE")
          .map((channel) => `• ${channel.id}: ${channel.name}`)
          .join("\n");
        message.reply(`Available Voice Channels:\n\n${channelList}`);
        break;
      }

      case "status": {
        const voiceConnection = client.voice.connections.get(message.guild.id);

        if (voiceConnection && voiceConnection.joinConfig.channelId) {
          const channel = client.channels.cache.get(
            voiceConnection.joinConfig.channelId
          );

          if (channel) {
            try {
              const ping = voiceConnection._state.ping;
              message.reply(
                [
                  `Current Voice Status:`,
                  `• Connected to: ${channel.name}`,
                  `• Channel ID: ${channel.id}`,
                  `• Latency: ${Math.round(ping)}ms`,
                ].join("\n")
              );
            } catch (error) {
              console.error("Error fetching ping:", error);
              message.reply(
                "There was an error calculating latency. Connection details are available though."
              );
            }
          } else {
            message.reply(
              "Connected to a channel, but channel info not found."
            );
          }
        } else {
          message.reply("Not connected to any voice channel.");
        }
        break;
      }

      case "leave": {
        const voiceConnection = client.voice.connections.get(message.guild.id);

        if (voiceConnection) {
          try {
            voiceConnection.destroy();
            message.reply("Left voice channel.");
          } catch (error) {
            console.error("Error disconnecting from voice channel:", error);
            message.reply(`Error leaving voice channel: ${error.message}`);
          }
        } else {
          message.reply("Not in a voice channel.");
        }
        break;
      }

      case "rotate": {
        const voiceChannels = message.guild.channels.cache.filter(
          (c) => c.type === "GUILD_VOICE"
        );

        if (voiceChannels.size === 0) {
          return message.reply("No voice channels available.");
        }

        message.reply(
          "Starting voice channel rotation (experimental). This is not fully implemented."
        );

        let isRotating = true;
        async function startRotation() {
          while (isRotating) {
            try {
              const firstChannel = voiceChannels.first();
              const voiceConnection = await joinVoiceChannel({
                channelId: firstChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
              });

              console.log(`Moved to channel: ${firstChannel.name}`);

              for (const channel of voiceChannels.values()) {
                if (isRotating) {
                  try {
                    voiceConnection.joinConfig.channelId = channel.id;
                    break;
                  } catch (error) {
                    console.error(
                      `Error trying to rotate to ${channel.name}:`,
                      error
                    );
                  }
                } else {
                  break;
                }
              }

              await new Promise((resolve) => setTimeout(resolve, 10000));
            } catch (error) {
              console.error(`Error rotating to next voice channel:`, error);
            }
          }

          console.log("Voice channel rotation stopped.");
        }

        startRotation();
        break;
      }

      default:
        message.reply(
          `Invalid vcjoin subcommand. Use: stable <channel_id>, list, status, leave, rotate.`
        );
    }
  },
};
