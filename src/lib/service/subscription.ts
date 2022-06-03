import { MusicSubscription } from '../components/MusicSubscription';

export class SubscriptionService {
  private subscriptions: Map<string, MusicSubscription>;

  constructor() {
    this.subscriptions = new Map<string, MusicSubscription>();
  }

  public deleteSubscription(guildId: string) {
    this.subscriptions.delete(guildId);
  }

  public getSubscription(guildId: string) {
    return this.subscriptions.get(guildId);
  }

  public setSubscription(guildId: string, subscription: MusicSubscription) {
    this.subscriptions.set(guildId, subscription);
  }
}
