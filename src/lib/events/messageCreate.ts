import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client, Message } from 'discord.js';
import { CommandService } from '../service/command';
import { SubscriptionService } from '../service/subscription';
import { CLIENT_ID, TOKEN } from '../../config.json';

export default {
  name: 'messageCreate',
  once: false,
  async execute(
    commandService: CommandService,
    subscriptionService: SubscriptionService,
    client: Client,
    ...args: Array<any>
  ) {
    if (!args.length || !(args[0] instanceof Message)) {
      return;
    }
    const message = args[0] as Message;
    if (!message.guild) {
      return;
    }
    if (!client.application?.owner) {
      await client.application?.fetch();
    }
    if (message.content.toLocaleLowerCase() !== '!deploy') {
      return;
    }
    if (message.author.id === client.application?.owner?.id) {
      const commands = [...(await commandService.getCommands()).values()].map(
        (command) => command.data.toJSON()
      );
      const rest = new REST({ version: '9' }).setToken(TOKEN);
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, message.guildId || ''),
        {
          body: commands,
        }
      );
      await message.reply('Deployed!');
    } else {
      await message.reply(`Please ask the bot's owner to do this!`);
    }
  },
};
