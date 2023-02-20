import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client, Message, EmojiIdentifierResolvable } from 'discord.js';
import { CommandService } from '../service/command';
import { SubscriptionService } from '../service/subscription';
import { CLIENT_ID, TOKEN } from '../../config.json';

const outcome = {
    e: 0,
    notE: 1,
};

const addOutcome = (result: boolean, amount: number) => {
    if (result) {
        outcome.e += amount;
    } else {
        outcome.notE += amount;
    }
};

const isCreatorWeight = (authorId: string, applicationOwnerId: string) => {
    return authorId === applicationOwnerId;
};

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
        if (client.application?.id === message.author.id) {
            return;
        }
        if (message.content.toLowerCase() === '!deploy') {
            if (message.author.id === client.application?.owner?.id) {
                const commands = [
                    ...(await commandService.getCommands()).values(),
                ].map((command) => command.data.toJSON());
                const rest = new REST({ version: '9' }).setToken(TOKEN);
                await rest.put(
                    Routes.applicationGuildCommands(
                        CLIENT_ID,
                        message.guildId || ''
                    ),
                    {
                        body: commands,
                    }
                );
                await message.reply('Deployed!');
            } else {
                await message.reply(`Please ask the bot's owner to do this!`);
            }
        } else {
            outcome.e = 0;
            outcome.notE = 0;

            if (client.application?.owner?.id) {
                addOutcome(
                    isCreatorWeight(
                        message.author.id,
                        client.application.owner.id
                    ),
                    100
                );
            }
            addOutcome(new Date().getDay() % 2 === 0, new Date().getDate());

            const probability = outcome.e / (outcome.e + outcome.notE);
            const reactWithE = Math.random() > 1 - probability;
            console.log(`Normal E? ${reactWithE}`);

            if (Math.random() > 0.5) {
                message.react('\u{1F1EA}');
            }
        }
    },
};
