import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { CommandService } from '../service/command';
import { SubscriptionService } from '../service/subscription';

export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the song that is currently playing'),
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
      subscription.audioPlayer.pause();
      await interaction.reply({ content: `Paused!`, ephemeral: true });
    } else {
      await interaction.reply('Not playing in this server!');
    }
  },
};
