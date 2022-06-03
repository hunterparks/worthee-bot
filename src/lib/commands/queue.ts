import { SlashCommandBuilder } from '@discordjs/builders';
import { AudioPlayerStatus, AudioResource } from '@discordjs/voice';
import { Interaction } from 'discord.js';
import { Track } from '../components/track';
import { CommandService } from '../service/command';
import { SubscriptionService } from '../service/subscription';

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('See the music queue'),
  async execute(
    commandService: CommandService,
    subscriptionService: SubscriptionService,
    interaction: Interaction
  ) {
    if (!interaction.isCommand() || !interaction.guildId) {
      return;
    }
    let subscription = subscriptionService.getSubscription(interaction.guildId);
    if (subscription) {
      const current =
        subscription.audioPlayer.state.status === AudioPlayerStatus.Idle
          ? `Nothing is currently playing!`
          : `🎶 Playing:\n**${
              (subscription.audioPlayer.state.resource as AudioResource<Track>)
                .metadata.title
            }**`;
      const queue = subscription.queue
        .slice(0, 5)
        .map((track, index) => `${index + 1}) ${track.title}`)
        .join('\n');
      await interaction.reply(`${current}\n\n${queue}`);
    } else {
      await interaction.reply('Not playing in this server!');
    }
  },
};
