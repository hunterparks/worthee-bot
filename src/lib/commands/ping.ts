import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { CommandService } from '../service/command';
import { SubscriptionService } from '../service/subscription';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong!'),
  async execute(
    commandService: CommandService,
    subscriptionService: SubscriptionService,
    interaction: Interaction
  ) {
    if (!interaction.isCommand()) {
      return;
    }
    await interaction.reply('Pong!');
  },
};
