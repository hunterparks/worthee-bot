import { CommandService } from './lib/service/command';
import { DiscordService } from './lib/service/discord';
import { EventService } from './lib/service/event';
import { SubscriptionService } from './lib/service/subscription';

class WortheeBot {
  private readonly commandService: CommandService;
  private readonly eventService: EventService;
  private readonly subscriptionService: SubscriptionService;
  private readonly discordService: DiscordService;

  constructor() {
    this.commandService = new CommandService();
    this.eventService = new EventService();
    this.subscriptionService = new SubscriptionService();
    this.discordService = new DiscordService(
      this.commandService,
      this.eventService,
      this.subscriptionService
    );
    process.on('SIGINT', () => {
      console.log('Bot stopped with SIGINT');
      this.discordService.destroy();
    });
    process.on('SIGTERM', () => {
      console.log('Bot stopped with SIGTERM');
      this.discordService.destroy();
    });
  }

  public async setup() {
    await this.discordService.setup();
  }
}

new WortheeBot().setup();
