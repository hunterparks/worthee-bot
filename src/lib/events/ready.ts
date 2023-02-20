import { ActivityOptions, ActivityType, Client } from 'discord.js';
import { version } from '../../../package.json';

// Competing in
// Listening to
// Playing
// Streaming
// Watching

const activities: Array<ActivityOptions> = [
    {
        name: 'hard to get ❤️',
        type: ActivityType.Playing,
    },
    {
        name: 'the 2024 Olympics 🥇',
        type: ActivityType.Competing,
    },
    {
        name: 'Hozier 🎧',
        type: ActivityType.Listening,
    },
    {
        name: 'Tom with caution ⚠️',
        type: ActivityType.Watching,
    },
    {
        name: 'Herbie: Fully Loaded 🎥',
        url: 'http://www.youtube.com/watch?v=AOru2NYcPxc',
        type: ActivityType.Streaming,
    },
];

const setRandomActivity = (client: Client) => {
    if (client.user) {
        client.user.setActivity(
            activities[Math.floor(Math.random() * activities.length)]
        );
    }
};

export default {
    name: 'ready',
    once: true,
    execute(...args: Array<any>) {
        if (!args.length || !(args[0] instanceof Client)) {
            return;
        }
        const client = args[0] as Client;
        console.log(`Worthee Bot ready - logged in as ${client?.user?.tag}!`);
        client.user?.setActivity({
            name: `with v${version}`,
            type: ActivityType.Watching,
        });
        // After 10 secs
        setTimeout(() => {
            setRandomActivity(client);
            // Every 10 mins
            setInterval(() => {
                setRandomActivity(client);
            }, 1000 * 60 * 10);
        }, 1000 * 10);
    },
};
