import * as fs from 'node:fs';
import * as path from 'node:path';
import { EventType } from '../types';

export class EventService {
  private events: Array<EventType>;

  constructor() {
    this.events = new Array<EventType>();
  }

  public async getEvents() {
    if (!this.events.length) {
      await this.generateEvents();
    }
    return this.events;
  }

  private async generateEvents(): Promise<void> {
    const eventsPath = path.join(__dirname, '..', 'events');
    await Promise.all(
      fs
        .readdirSync(eventsPath)
        .filter((file) => file.endsWith('.js'))
        .map(async (file) => {
          const filePath = path.join(eventsPath, file);
          const { name, once, execute } = (await import(filePath))['default'];
          const event = {
            name,
            once,
            execute,
          } as EventType;
          this.events.push(event);
        })
    );
  }
}
