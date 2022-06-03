import { SlashCommandBuilder } from '@discordjs/builders';
import {
  DiscordGatewayAdapterCreator,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { GuildMember, Interaction } from 'discord.js';
import { MusicSubscription } from '../components/MusicSubscription';
import { Track } from '../components/track';
import { CommandService } from '../service/command';
import { SubscriptionService } from '../service/subscription';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song!')
    .addStringOption((option) =>
      option
        .setName('song')
        .setDescription('A URL of the song to play')
        .setRequired(true)
    ),
  async execute(
    commandService: CommandService,
    subscriptionService: SubscriptionService,
    interaction: Interaction
  ) {
    if (!interaction.isCommand() || !interaction.guildId) {
      return;
    }
    let subscription = subscriptionService.getSubscription(interaction.guildId);
    await interaction.deferReply();
    const url = interaction.options.get('song')!.value! as string;
    if (!subscription) {
      if (
        interaction.member instanceof GuildMember &&
        interaction.member.voice.channel
      ) {
        const channel = interaction.member.voice.channel;
        subscription = new MusicSubscription(
          joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild
              .voiceAdapterCreator as DiscordGatewayAdapterCreator,
          }),
          subscriptionService,
          interaction.guildId
        );
        subscription.voiceConnection.on('error', console.warn);
        subscriptionService.setSubscription(interaction.guildId, subscription);
      }
    }

    if (!subscription) {
      await interaction.followUp(
        'Join a voice channel and then try that again!'
      );
      return;
    }

    try {
      await entersState(
        subscription.voiceConnection,
        VoiceConnectionStatus.Ready,
        20e3
      );
    } catch (error) {
      console.warn(error);
      await interaction.followUp(
        'Failed to join voice channel within 30 seconds, please try again later!'
      );
      return;
    }

    try {
      const track = await Track.from(url, {
        onStart(videoInfo) {
          interaction
            .followUp({
              content: `🎶 Now playing:\n${videoInfo.url}`,
              ephemeral: true,
            })
            .catch(console.warn);
        },
        onFinish() {
          interaction
            .followUp({ content: 'Now finished!', ephemeral: true })
            .catch(console.warn);
        },
        onError(error) {
          console.warn(error);
          interaction
            .followUp({ content: `Error: ${error.message}`, ephemeral: true })
            .catch(console.warn);
        },
      });
      subscription.enqueue(track);
      if (subscription.queue?.length) {
        interaction.followUp('Queued!');
      }
    } catch (error) {
      console.warn(error);
      await interaction.followUp(
        'Failed to play track, please try again later!'
      );
    }
  },
};
