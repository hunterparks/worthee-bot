import { Client, ChatInputCommandInteraction } from 'discord.js';
import { CommandService } from '../service/command';
import { SubscriptionService } from '../service/subscription';

export default {
  name: 'interactionCreate',
  once: false,
  async execute(
    commandService: CommandService,
    subscriptionService: SubscriptionService,
    client: Client,
    ...args: Array<any>
  ) {
    if (!args.length || !(args[0] instanceof ChatInputCommandInteraction)) {
      return;
    }
    const interaction = args[0] as ChatInputCommandInteraction;

    if (!interaction.isCommand()) {
      return;
    }

    const command = (await commandService.getCommands()).get(
      interaction.commandName
    );
    try {
      command?.execute(commandService, subscriptionService, interaction);
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  },
};
