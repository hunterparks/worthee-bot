import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { CommandService } from '../service/command';
import { SubscriptionService } from '../service/subscription';

export default {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave the voice channel'),
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
      subscription.voiceConnection.destroy();
      subscriptionService.deleteSubscription(interaction.guildId);
      await interaction.reply({ content: `Left channel!`, ephemeral: true });
    } else {
      await interaction.reply('Not playing in this server!');
    }
  },
};
