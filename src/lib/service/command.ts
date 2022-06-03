import * as fs from 'node:fs';
import * as path from 'node:path';
import { CommandType } from '../types';

export class CommandService {
  private commands: Map<string, CommandType>;

  constructor() {
    this.commands = new Map<string, CommandType>();
  }

  public async getCommands() {
    if (!this.commands.size) {
      await this.generateCommands();
    }
    return this.commands;
  }

  private async generateCommands() {
    const commandsPath = path.join(__dirname, '..', 'commands');
    await Promise.all(
      fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'))
        .map(async (file) => {
          const filePath = path.join(commandsPath, file);
          const { data, execute } = (await import(filePath))['default'];
          const command = {
            data,
            execute,
          } as CommandType;
          this.commands.set(command.data.name, command);
        })
    );
  }
}
