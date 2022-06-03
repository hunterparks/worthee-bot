import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { CommandService } from './service/command';
import { SubscriptionService } from './service/subscription';

export interface CommandType {
  data: SlashCommandBuilder;
  execute(
    commandService: CommandService,
    subscriptionService: SubscriptionService,
    interaction: Interaction
  ): Promise<void>;
}

export interface EventType {
  name: string;
  once: boolean;
  execute(...args: Array<any>): Promise<void>;
}

export interface VideoInfoType {
  title: string;
  url: string;
}
