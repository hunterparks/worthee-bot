import { Client } from 'discord.js';

export default {
  name: 'ready',
  once: true,
  execute(...args: Array<any>) {
    if (!args.length || !(args[0] instanceof Client)) {
      return;
    }
    const client = args[0] as Client;
    console.log(`Worthee Bot ready - logged in as ${client?.user?.tag}!`);
  },
};
