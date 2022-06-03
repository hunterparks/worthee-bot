import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { CommandService } from '../service/command';
import { SubscriptionService } from '../service/subscription';

export default {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume playback of the current song'),
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
      subscription.audioPlayer.unpause();
      await interaction.reply({ content: `Unpaused!`, ephemeral: true });
    } else {
      await interaction.reply('Not playing in this server!');
    }
  },
};
