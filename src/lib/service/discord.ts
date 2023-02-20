import { Client, GatewayIntentBits, Message } from 'discord.js';
import { CommandService } from './command';
import { CLIENT_ID, TOKEN } from '../../config.json';
import { EventService } from './event';
import { SubscriptionService } from './subscription';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

export class DiscordService {
    private client: Client;

    constructor(
        private commandService: CommandService,
        private eventService: EventService,
        private subscriptionService: SubscriptionService
    ) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });
    }

    public destroy() {
        this.client.destroy();
        process.exit(0);
    }

    public async setup() {
        for (let event of await this.eventService.getEvents()) {
            if (event.once) {
                this.client.once(event.name, (...args) =>
                    event.execute(...args)
                );
            } else {
                this.client.on(event.name, (...args) =>
                    event.execute(
                        this.commandService,
                        this.subscriptionService,
                        this.client,
                        ...args
                    )
                );
            }
        }

        await this.client.login(TOKEN);
    }
}
