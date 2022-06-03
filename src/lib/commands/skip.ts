import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { CommandService } from '../service/command';
import { SubscriptionService } from '../service/subscription';

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips to the next song in the queue'),
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
      subscription.audioPlayer.stop();
      await interaction.reply('Skipped song!');
    } else {
      await interaction.reply('Not playing in this server!');
    }
  },
};
